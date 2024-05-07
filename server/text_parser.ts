import extractEmail from "extract-email-address"
import extractor from "phonenumbers-extractor"
import { ParsedText } from "./dto"


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
    const mentions = ""

    let name = text.split("likes")[0].trim()
    if (name == text.trim()) {
        name = text.split("followers")[0].trim()
    }

    const email = extractEmailFromText(text)
    const phone = extractPhoneFromText(text)

    return {
        selectedtext: text,
        status: status,
        name: name || "",
        email: email || "",
        phone: phone || "",
        mentions: mentions || "",
        source: source
    }
}


function defaultParser(text: string, source: string): ParsedText {

    const status = "new"
    const mentions = ""

    return {
        selectedtext: text,
        status: status,
        name: "",
        email: extractEmailFromText(text) || "",
        phone: extractPhoneFromText(text) || "",
        mentions: mentions || "",
        source: source
    }
}


const parseMapper: { [key: string]: ParseFunction } = {
    "www.facebook.com": parseFacebookText
}


export default function textParser(text: string, source: string) {
    const host = source.split("//")[1].split("/")[0]
    const parser = parseMapper[host]
    if (!parser) return defaultParser(text, source)
    return parser(text, source)
}

