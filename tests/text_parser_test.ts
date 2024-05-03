import { test, expect, describe } from "bun:test"
import textParser from "../server/text_parser"



const expectedFacebookData = [
    {
        text: `Service Auto Oanea  238 likes • 331 followers Following Message Search More Posts About Mentions Reviews Reels Photos Intro Service Auto / Tractări Auto / Geometrie 3D Page · Vehicle repair shop · Vehicle, aircraft and boat Strada Mihai Eminescu, nr.30 0744 834 222 serviceauto.oanea@gmail.com auto-oanea.ro`,
        expected: {
            name: "Service Auto Oanea",
            tags: "Vehicle repair shop, Vehicle, aircraft, boat",
            email: "serviceauto.oanea@gmail.com",
            phone: "0744 834 222",
        }
    },

    {
        text: `Polish Auto Iasi  1.4K likes • 1.7K followers Message Following Search More Posts About Mentions Reviews Reels Photos Intro POLISH AUTO PROTECTII CERAMICE DETAILING AUTO FOLIERI PPF ASIGURARI Page · Vehicle detailing service Bld. Poitiers nr.2, Iasi, Romania 0756 824 374 135cypryan@gmail.com polishautoiasi.ro Closed now Price range · ££`,
        expected: {
            name: "Polish Auto Iasi",
            tags: "Vehicle detailing service",
            email: "135cypryan@gmail.com",
            phone: "0756 824 374",
        }
    },

    {
        text: `Cabinet stomatologic Dr. Jeler Monica  708 followers • 53 following Message Following Search More Posts About Mentions Reviews Reels Photos Intro Cabinet stomatologic Page · General dentist Str. Dimitrie Cantemir 36 - cart. Strand, Sibiu, Romania 0740 177 157 moni.jeler@yahoo.com Closed now`,
        expected: {
            name: "Cabinet stomatologic Dr. Jeler Monica",
            tags: "General dentist",
            email: "moni.jeler@yahoo.com",
            phone: "0740 177 157",
        }
    },

    {
        text: `EP Lab Colentina  580 likes • 589 followers Liked Message Search More Posts About Mentions Reviews Followers Photos Intro Laborator de electrofiziologie cardiaca invaziva Page · Medical centre Sos. Stefan cel Mare 19-21, Bucharest, Romania 021 318 0615 eplabcolentina@gmail.com Always open`,
        expected: {
            name: "EP Lab Colentina",
            tags: "Medical centre",
            email: "eplabcolentina@gmail.com",
            phone: "021 318 0615",
        }
    },

    {
        text: `Dr. Georgiana Prodan  630 likes • 733 followers WhatsApp Liked Message More Posts About Mentions Reviews Reels Photos Intro Implantologie orala Endodontie si odontoterapie sub microscop Digital Dentistry Protetica dentara Estetica dentara Page · General dentist Traian 121, Galati, Romania 0236 320 504 Dr. Georgiana Prodan Closed now`,
        expected: {
            name: "Dr. Georgiana Prodan",
            tags: "General dentist",
            email: null,
            phone: "0236 320 504",
        }
    },

    {
        text: `Dr. Chifăr Diana MD  531 likes • 548 followers Liked Message Search More Posts About Mentions Reviews Followers Photos Intro Page · Endodontist Timisoara, Romania Chifar_diana@yahoo.com dr.chifardiana`,
        expected: {
            name: "Dr. Chifăr Diana MD",
            tags: "Endodontist",
            email: "Chifar_diana@yahoo.com",
            phone: null,
        }
    },

    {
        text: `Stomatologie Bucuresti Sector 3  525 likes • 529 followers Contact Us Liked Message More Posts About Mentions Reviews Followers Photos Intro Cabinet stomatologic sector 3 Bucuresti. Ozzye's Dent. Stomatologie la cele mai accesibile preturi. Page · General dentist Str. Alexandru Moruzzi Voievod 4A, Bucharest, Romania 0727 646 343 stomatologie.sector3@gmail.com stomatologie-sector3.ro Closed now Price range · £££`,
        expected: {
            name: "Stomatologie Bucuresti Sector 3",
            tags: "General dentist",
            email: "stomatologie.sector3@gmail.com",
            phone: "0727 646 343",
        }
    },
]



describe("parsed text", () => {

    test("extracted facebook data", () => {

        for (let data of expectedFacebookData) {
            const result = textParser(data.text, "www.facebook.com")
            console.log(result)
        }

    })

})


