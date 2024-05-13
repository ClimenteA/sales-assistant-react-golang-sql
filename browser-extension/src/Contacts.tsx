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




export default function Contacts() {
    let [column, setColumn] = useState("")
    let [value, setValue] = useState("")
    let [contacts, setContacts] = useState<ParsedText[]>([])

    useEffect(() => {
        fetchAllContacts().then(res => setContacts(res))
    }, [])

    return (
        <div style={{ marginTop: "1rem" }}>

            <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
                <strong style={{ display: "block", marginBottom: "1rem" }}>Filter column</strong>
                <select value={column} onChange={e => setColumn(e.target.value)} name="column" aria-label="Select column" required>
                    <option selected>Name</option>
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


            {contacts.map(c => <a style={{ display: "block", marginBottom: "1rem" }} href={c.url} target="_blank">
                <strong>{c.status} - {c.name}</strong>
            </a>)}

        </div>
    )
}