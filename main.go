package main

import (
	"fmt"
	"log"
	"os"
	"sales-assistant/handlers"

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

	app.Post("/find-contact", func(c *fiber.Ctx) error {
		var err error
		filterContact := new(handlers.FilterContact)
		if err = c.BodyParser(filterContact); err != nil {
			return err
		}

		foundContacts, err := handlers.FindContactByColumValue(*filterContact)
		fmt.Println(foundContacts)

		if err != nil {
			return c.JSON(foundContacts)
		}
		return c.JSON(foundContacts)
	})

	err := app.Listen(":" + os.Getenv("SALES_ASSISTANT_PORT"))
	if err != nil {
		log.Fatal(err.Error())
	}

}
