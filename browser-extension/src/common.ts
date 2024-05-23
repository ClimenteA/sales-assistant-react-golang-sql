
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



export async function findContactByColumn(column: string, value: string) {

    try {

        let response = await fetch(`http://localhost:${PORT}/find-contact`, {
            method: "POST",
            body: JSON.stringify({ column, value }),
            headers: headers
        })

        let parsed = await response.json()
        console.log(parsed)
        return parsed

    } catch (error) {
        console.error(error)
    }

    return {}
}



export async function serverIsOnline() {

    try {

        let response = await fetch(`http://localhost:${PORT}/server-running`, {
            method: "GET",
            headers: headers
        })

        let parsed = await response.json()
        return parsed

    } catch (error) {
        console.error(error)
    }

    return { message: "failed" }

}
