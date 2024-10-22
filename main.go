package main

import (
	"log"
	"os"
	"sales-assistant/handlers"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	_ "github.com/joho/godotenv/autoload"
)

func main() {

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool { return true },
		AllowHeaders:     "*",
	}))
	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/server-running", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "server is running"})
	})

	app.Post("/export-tables", func(c *fiber.Ctx) error {
		err := handlers.ExportTables()
		if err != nil {
			c.Status(500)
			return c.JSON(fiber.Map{"message": "failed to export data"})
		}
		return c.JSON(fiber.Map{"message": "data exported"})
	})

	app.Post("/import-tables", func(c *fiber.Ctx) error {
		err := handlers.ImportTables()
		if err != nil {
			c.Status(500)
			return c.JSON(fiber.Map{"message": "failed to import data"})
		}
		return c.JSON(fiber.Map{"message": "data imported"})
	})

	app.Post("/parse-text", func(c *fiber.Ctx) error {
		var err error
		contact := new(handlers.ContactInfo)
		if err = c.BodyParser(contact); err != nil {
			return err
		}
		result := handlers.TextParser(*contact)
		return c.JSON(result)
	})

	app.Post("/save-contact", func(c *fiber.Ctx) error {
		var err error
		contact := new(handlers.ContactInfo)
		if err = c.BodyParser(contact); err != nil {
			return err
		}
		err = handlers.SaveContact(*contact)
		if err != nil {
			c.Status(500)
			return c.JSON(fiber.Map{"message": "failed to save"})
		}
		return c.JSON(fiber.Map{"message": "success"})
	})

	app.Post("/filter-contacts", func(c *fiber.Ctx) error {
		var err error
		filterContact := new(handlers.FilterContact)
		if err = c.BodyParser(filterContact); err != nil {
			return err
		}

		foundContacts, err := handlers.FilterContactsByColumnPartialValue(*filterContact)
		if err != nil {
			return c.JSON(foundContacts)
		}
		return c.JSON(foundContacts)
	})

	app.Post("/find-contact", func(c *fiber.Ctx) error {
		var err error
		filterContact := new(handlers.FilterContact)
		if err = c.BodyParser(filterContact); err != nil {
			return err
		}

		foundContacts, err := handlers.SuggestContactsByColumValue(*filterContact)
		if err != nil {
			return c.JSON(foundContacts)
		}
		return c.JSON(foundContacts)
	})

	app.Get("/contacts", func(c *fiber.Ctx) error {
		contacts, err := handlers.GetAllContacts()
		if err != nil {
			return c.JSON(contacts)
		}
		return c.JSON(contacts)
	})

	PORT := os.Getenv("SALES_ASSISTANT_PORT")
	if len(PORT) == 0 {
		PORT = strconv.Itoa(4520)
	}

	err := app.Listen(":" + PORT)
	if err != nil {
		log.Fatal(err.Error())
	}

}
