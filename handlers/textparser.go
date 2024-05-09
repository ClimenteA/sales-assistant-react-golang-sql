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

	if strings.Contains(contact.Url, "facebook.com") || strings.Contains(contact.Url, "linkedin.com") {
		return strings.TrimSpace(strings.Split(contact.RawText, "\n")[0])
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

		parsedContact := ContactInfo{
			RawText:  contact.RawText,
			Name:     name,
			Email:    emails,
			Phone:    phones,
			Status:   existingContact.Status,
			Mentions: existingContact.Mentions,
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
