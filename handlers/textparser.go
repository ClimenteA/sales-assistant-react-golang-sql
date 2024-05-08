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

func TextParser(contact ContactInfo) ContactInfo {
	emails := findEmails(contact.RawText)
	phones := findPhoneNumbers(contact.RawText)

	parsedContact := ContactInfo{
		RawText: contact.RawText,
		Email:   strings.Join(emails, ", "),
		Phone:   strings.Join(phones, ", "),
	}

	return parsedContact

}
