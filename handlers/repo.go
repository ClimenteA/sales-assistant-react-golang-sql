package handlers

import (
	"fmt"
	"strings"

	repo "github.com/ClimenteA/gobadrepo"
	"github.com/gofiber/fiber/v2/log"
	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

func init() {

	DB = sqlx.MustConnect("sqlite3", "database.db")

	err := repo.CreateTable(DB, ContactInfo{})
	if err != nil {
		panic(err)
	}
}

func FindContactByUrl(url string) (ContactInfo, error) {

	if strings.HasSuffix(url, "/overlay/contact-info/") && strings.Contains(url, "linkedin.com") {
		url = strings.Replace(url, "/overlay/contact-info/", "/", 1)
	}

	var contact ContactInfo
	err := repo.FindOne(DB, ContactInfo{Url: url}, &contact)
	if err != nil {
		return contact, err
	}
	return contact, nil
}

func FindContactByColumValue(partialContact FilterContact) ([]ContactInfo, error) {

	contacts := []ContactInfo{}

	if partialContact.Column == "name" {
		err := DB.Select(&contacts, "SELECT * FROM contactinfos WHERE name LIKE ? LIMIT 100", "%"+partialContact.Value+"%")
		if err != nil {
			return contacts, err
		}
		return contacts, nil
	}

	if partialContact.Column == "status" {
		err := DB.Select(&contacts, "SELECT DISTINCT status FROM contactinfos WHERE status LIKE ? LIMIT 100", "%"+partialContact.Value+"%")
		if err != nil {
			return contacts, err
		}
		return contacts, nil
	}

	if partialContact.Column == "url" {
		err := DB.Select(&contacts, "SELECT * FROM contactinfos WHERE url=?", partialContact.Value)
		if err != nil {
			return contacts, err
		}
		return contacts, nil
	}

	return contacts, nil
}

func SaveContact(contact ContactInfo) error {

	existingContact, err := FindContactByUrl(contact.Url)

	if err != nil {
		log.Info("New contact:", contact)
		if len(contact.Name) > 0 {
			err = repo.InsertOne(DB, contact)
			return err
		} else {
			return fmt.Errorf("field name is mandatory")
		}
	}

	name := contact.Name
	if name == "" {
		name = existingContact.Name
	}

	status := contact.Status
	if status == "" {
		status = existingContact.Status
	}

	email := contact.Email
	if email == "" {
		email = existingContact.Email
	}

	phone := contact.Phone
	if phone == "" {
		phone = existingContact.Phone
	}

	mentions := contact.Mentions
	if mentions == "" {
		mentions = existingContact.Mentions
	}

	rawText := ""
	if existingContact.RawText == contact.RawText {
		rawText = contact.RawText
	} else {
		rawText = existingContact.RawText + "\n" + contact.RawText
	}

	concatContact := ContactInfo{
		RawText:  rawText,
		Name:     name,
		Status:   status,
		Email:    email,
		Phone:    phone,
		Mentions: mentions,
		Url:      existingContact.Url,
	}

	if len(concatContact.Name) > 0 {
		log.Infof("\nUpdated contact: %+v", concatContact)
		err = repo.UpdateMany(DB, ContactInfo{Id: existingContact.Id}, concatContact)
		if err != nil {
			return err
		}
	} else {
		return fmt.Errorf("field name is mandatory")
	}

	return nil

}
