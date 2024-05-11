package handlers

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/mcnijman/go-emailaddress"
)

func findEmails(rawtext string) []string {

	text := []byte(rawtext)

	foundEmails := emailaddress.FindWithIcannSuffix(text, false)

	emails := []string{}
	for _, e := range foundEmails {
		emails = append(emails, strings.ToLower(strings.TrimSpace(e.String())))
	}

	return emails
}

func findPhoneNumbers(rawtext string) []string {

	text := strings.ReplaceAll(rawtext, " ", "")
	text = strings.ReplaceAll(text, "-", "")

	re := regexp.MustCompile(`\d+`)
	allNumbers := re.FindAllString(text, -1)

	possiblePhoneNumbers := []string{}
	for _, num := range allNumbers {
		if len(num) >= 8 {
			possiblePhoneNumbers = append(possiblePhoneNumbers, strings.TrimSpace(num))
		}
	}

	return possiblePhoneNumbers
}

func findName(contact ContactInfo) string {

	for _, site := range []string{
		"facebook.com",
		"instagram.com",
		"linkedin.com",
		"twitter.com",
		"x.com",
		"threads.net",
	} {
		if strings.Contains(contact.Url, site) {
			return strings.TrimSpace(strings.Split(contact.RawText, "\n")[0])
		}
	}

	return ""

}

func TextParser(contact ContactInfo) ContactInfo {

	fmt.Println("TEXT:", contact.RawText)

	emails := strings.Join(findEmails(contact.RawText), ", ")
	phones := strings.Join(findPhoneNumbers(contact.RawText), ", ")
	name := findName(contact)

	existingContact, err := FindContactByUrl(contact.Url)
	if err == nil {

		fmt.Println("Existing contact")

		if strings.Contains(emails, name) && existingContact.Email == "" {
			name = existingContact.Name
		}

		if name == "" && existingContact.Name != "" {
			name = existingContact.Name
		}

		if emails == "" && existingContact.Email != "" {
			emails = existingContact.Email
		}

		if phones == "" && existingContact.Phone != "" {
			phones = existingContact.Phone
		}

		if contact.Status == "" && existingContact.Status != "" {
			contact.Status = existingContact.Status
		}

		if contact.Mentions == "" && existingContact.Mentions != "" {
			contact.Mentions = existingContact.Mentions
		}

		parsedContact := ContactInfo{
			RawText:  contact.RawText,
			Name:     name,
			Email:    emails,
			Phone:    phones,
			Status:   contact.Status,
			Mentions: contact.Mentions,
			Url:      contact.Url,
		}
		return parsedContact
	}

	fmt.Println("New contact")

	parsedContact := ContactInfo{
		RawText: contact.RawText,
		Name:    name,
		Email:   emails,
		Phone:   phones,
		Url:     contact.Url,
	}

	return parsedContact

}
