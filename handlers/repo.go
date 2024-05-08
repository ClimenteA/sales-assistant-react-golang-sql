package handlers

import (
	repo "github.com/ClimenteA/gobadrepo"
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

func FindContactByUrl(safeurl string) (ContactInfo, error) {
	var contact ContactInfo
	err := repo.FindOne(DB, ContactInfo{SafeUrl: safeurl}, &contact)
	if err != nil {
		return contact, err
	}
	return contact, nil
}

func SaveContact(contact ContactInfo) error {

	existingContact, err := FindContactByUrl(contact.SafeUrl)

	if existingContact.Id == 0 && err == nil {
		err = repo.InsertOne(DB, contact)
		return err
	}

	concatContact := ContactInfo{
		RawText:  existingContact.RawText + "\n" + contact.RawText,
		Status:   contact.Status,
		Email:    contact.Email,
		Phone:    contact.Phone,
		Mentions: contact.Mentions,
		Url:      contact.Url,
		SafeUrl:  contact.SafeUrl,
	}

	err = repo.UpdateMany(DB, ContactInfo{SafeUrl: contact.SafeUrl}, concatContact)
	if err != nil {
		return err
	}

	return nil

}
