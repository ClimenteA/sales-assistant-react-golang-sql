
export const PORT = 4520

export const headers = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}


export type RawData = {
    raw_text: string
    url: string
}

export type ParsedText = {
    raw_text: string
    status: string
    name: string
    email: string
    phone: string
    mentions: string
    url: string
}
