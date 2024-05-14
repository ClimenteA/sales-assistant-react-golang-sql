package handlers

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"strconv"
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

func GetAllContacts() ([]ContactInfo, error) {

	contacts := []ContactInfo{}

	err := DB.Select(&contacts, "SELECT name, status, url FROM contactinfos")
	if err != nil {
		return contacts, err
	}
	return contacts, nil

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

func FilterContactsByColumnPartialValue(partialContact FilterContact) ([]ContactInfo, error) {

	contacts := []ContactInfo{}

	err := DB.Select(&contacts, "SELECT name, status, url FROM contactinfos WHERE "+partialContact.Column+" LIKE ?", "%"+partialContact.Value+"%")
	if err != nil {
		return contacts, err
	}
	return contacts, nil
}

func SuggestContactsByColumValue(partialContact FilterContact) ([]ContactInfo, error) {

	contacts := []ContactInfo{}

	if partialContact.Column == "name" {
		err := DB.Select(&contacts, "SELECT * FROM contactinfos WHERE name LIKE ?", "%"+partialContact.Value+"%")
		if err != nil {
			return contacts, err
		}
		return contacts, nil
	}

	if partialContact.Column == "status" {
		err := DB.Select(&contacts, "SELECT DISTINCT status FROM contactinfos WHERE status LIKE ?", "%"+partialContact.Value+"%")
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

	concatContact := ContactInfo{
		RawText:  contact.RawText,
		Name:     name,
		Status:   status,
		Email:    email,
		Phone:    phone,
		Mentions: mentions,
		Url:      existingContact.Url,
	}

	if len(concatContact.Name) > 0 {
		err = repo.DeleteMany(DB, ContactInfo{Id: existingContact.Id})
		if err != nil {
			return err
		}
		err = repo.InsertOne(DB, concatContact)
		if err != nil {
			return err
		}
	} else {
		return fmt.Errorf("field name is mandatory")
	}

	return nil

}

func ExportTables() error {

	err := os.MkdirAll("exports", os.ModePerm)
	if err != nil {
		return err
	}

	rows, err := DB.Queryx("SELECT * FROM contactinfos")
	if err != nil {
		return err
	}

	var csvFile *os.File
	writer := &csv.Writer{}

	counter := 0
	fileCounter := 0

	// Write data to CSV
	for rows.Next() {
		// Create a new file every 800,000 rows
		if counter%800000 == 0 {
			if csvFile != nil {
				writer.Flush()
				csvFile.Close()
			}

			csvfilepath := path.Join("exports", fmt.Sprintf("contacts_export_%d.csv", fileCounter))
			csvFile, err = os.Create(csvfilepath)
			if err != nil {
				return err
			}
			defer csvFile.Close()

			writer = csv.NewWriter(csvFile)
			defer writer.Flush()

			// Write the header
			header := []string{"Id", "RawText", "Name", "Status", "Email", "Phone", "Mentions", "Url"}
			err = writer.Write(header)
			if err != nil {
				return err
			}

			fileCounter++
		}

		var contact ContactInfo
		err = rows.StructScan(&contact)
		if err != nil {
			return err
		}

		vals := []string{
			strconv.Itoa(contact.Id),
			contact.RawText,
			contact.Name,
			contact.Status,
			contact.Email,
			contact.Phone,
			contact.Mentions,
			contact.Url,
		}

		err = writer.Write(vals)
		if err != nil {
			return err
		}

		counter++
	}

	return nil
}

func ImportTables() error {
	// Get all CSV files from the 'exports' directory
	files, err := filepath.Glob("exports/*.csv")
	if err != nil {
		return err
	}

	// Iterate over each file
	for _, file := range files {
		f, err := os.Open(file)
		if err != nil {
			return err
		}
		defer f.Close()

		r := csv.NewReader(f)

		// Skip the header row
		_, err = r.Read()
		if err != nil {
			return err
		}

		// Read each record from csv
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				return err
			}

			// Convert the record to ContactInfo
			id, err := strconv.Atoi(record[0])
			if err != nil {
				return err
			}

			contact := ContactInfo{
				Id:       id,
				RawText:  record[1],
				Name:     record[2],
				Status:   record[3],
				Email:    record[4],
				Phone:    record[5],
				Mentions: record[6],
				Url:      record[7],
			}

			// Insert or update the record in the database
			_, err = DB.NamedExec(`INSERT INTO contactinfos (id, raw_text, name, status, email, phone, mentions, url) 
				VALUES (:id, :raw_text, :name, :status, :email, :phone, :mentions, :url)
				ON CONFLICT(id) DO UPDATE SET
				raw_text = excluded.raw_text,
				name = excluded.name,
				status = excluded.status,
				email = excluded.email,
				phone = excluded.phone,
				mentions = excluded.mentions,
				url = excluded.url`, &contact)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
