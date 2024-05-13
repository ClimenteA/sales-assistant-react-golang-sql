import { useEffect, useState } from "react"
import { ParsedText, headers, PORT } from "./common"


async function fetchAllContacts() {

    try {

        let response = await fetch(`http://localhost:${PORT}/contacts`, {
            method: "GET",
            headers: headers
        })

        let parsed = await response.json()
        return parsed

    } catch (error) {
        console.error(error)
    }

    alert(`Check if server is running on port ${PORT}!`)

}


export async function filterContactByColumnValuePartial(column: string, value: string) {

    try {

        let response = await fetch(`http://localhost:${PORT}/filter-contacts`, {
            method: "POST",
            body: JSON.stringify({ column, value }),
            headers: headers
        })

        let parsed = await response.json()
        console.log("column", column, "value", value, "result", parsed)
        return parsed

    } catch (error) {
        console.error(error)
    }

    alert(`Check if server is running on port ${PORT}!`)
}



export default function Contacts() {
    let [column, setColumn] = useState("")
    let [value, setValue] = useState("")
    let [contacts, setContacts] = useState<ParsedText[]>([])

    useEffect(() => {
        fetchAllContacts().then(res => setContacts(res))
    }, [])

    useEffect(() => {
        if (value.length > 0) {
            filterContactByColumnValuePartial(column, value).then((data) => {
                setContacts(data)
            })
        }
    }, [column, value])

    return (
        <div style={{ marginTop: "1rem" }}>

            <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
                <strong style={{ display: "block", marginBottom: "1rem" }}>Filter by column value</strong>
                <select value={column} onChange={e => setColumn(e.target.value)} name="column" aria-label="Select column" required>
                    <option>Name</option>
                    <option>Status</option>
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Mentions</option>
                    <option>RawText</option>
                    <option>Url</option>
                    <option>Id</option>
                </select>

                <label>
                    <strong>Value</strong>
                    <input type="text" name="value" value={value} onChange={e => setValue(e.target.value)} />
                </label>

            </div>

            {contacts && contacts.map((c, idx) => <a key={idx} style={{ display: "block", marginBottom: "1rem" }} href={c.url} target="_blank">
                <strong>{c.status} - {c.name}</strong>
            </a>)}

        </div>
    )
}