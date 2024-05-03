import extractEmail from "extract-email-address"
import extractor from "phonenumbers-extractor"


type ParsedText = {
    selectedtext: string
    status: string
    tags: string
    name: string
    email: string
    phone: string
    source: string
}


type ExtractedEmail = {
    email: string
}

type ParseFunction = (text: string, source: string) => ParsedText


function extractEmailFromText(text: string) {
    let emails: Array<ExtractedEmail> = extractEmail(text)
    if (emails.length == 0) return undefined

    let onlyEmails = []
    for (let d of emails) {
        onlyEmails.push(d.email)
    }
    return onlyEmails.join(", ")
}


function extractPhoneFromText(text: string) {
    const numbers = extractor.extractNumbers(text, 8)
    if (numbers.length == 0) return undefined
    let onlyNumbers = []
    for (let d of numbers) {
        onlyNumbers.push(d.originalFormat)
    }
    return onlyNumbers.join(", ")
}


function parseFacebookText(text: string, source: string): ParsedText {

    const status = "new"

    let name = text.split("likes")[0].trim()
    if (name == text.trim()) {
        name = text.split("followers")[0].trim()
    }

    const email = extractEmailFromText(text)
    const phone = extractPhoneFromText(text)

    return {
        selectedtext: text,
        status: status,
        tags: "",
        name: name || "",
        email: email || "",
        phone: phone || "",
        source: source
    }
}


function defaultParser(text: string, source: string): ParsedText {

    const status = "new"

    return {
        selectedtext: text,
        status: status,
        tags: "",
        name: "",
        email: extractEmailFromText(text) || "",
        phone: extractPhoneFromText(text) || "",
        source: source
    }
}


const parseMapper: { [key: string]: ParseFunction } = {
    "www.facebook.com": parseFacebookText
}


export default function textParser(text: string, source: string) {
    const parser = parseMapper[source]
    if (!parser) return defaultParser(text, source)
    return parser(text, source)
}

