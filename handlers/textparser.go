package handlers

import (
	"regexp"
	"strings"

	"github.com/mcnijman/go-emailaddress"
)

func findEmails(rawtext string) []string {

	text := []byte(rawtext)

	foundEmails := emailaddress.FindWithIcannSuffix(text, false)

	emails := []string{}
	for _, e := range foundEmails {
		emails = append(emails, e.String())
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
			possiblePhoneNumbers = append(possiblePhoneNumbers, num)
		}
	}

	return possiblePhoneNumbers
}

func findNameForFacebook(rawText string) string {
	return strings.Split(rawText, "\n")[0]
}

func findName(contact ContactInfo) string {

	if strings.Contains(contact.Url, "facebook.com") {
		return findNameForFacebook(contact.RawText)
	}

	return ""

}

func TextParser(contact ContactInfo) ContactInfo {
	emails := strings.Join(findEmails(contact.RawText), ", ")
	phones := strings.Join(findPhoneNumbers(contact.RawText), ", ")
	name := findName(contact)

	existingContact, err := FindContactByUrl(contact.SafeUrl)
	if err == nil {

		parsedContact := ContactInfo{
			RawText:  contact.RawText,
			Name:     name,
			Email:    emails,
			Phone:    phones,
			Status:   existingContact.Status,
			Mentions: existingContact.Mentions,
		}
		return parsedContact
	}

	parsedContact := ContactInfo{
		RawText: contact.RawText,
		Name:    name,
		Email:   emails,
		Phone:   phones,
	}

	return parsedContact

}
