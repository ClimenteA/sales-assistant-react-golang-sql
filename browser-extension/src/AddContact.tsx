import { useState, FormEvent, useEffect } from 'react'
import { ParsedText, headers, PORT, findContactByColumn } from "./common"

async function saveContact(data: ParsedText) {

    try {

        let response = await fetch(`http://localhost:${PORT}/save-contact`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers
        })

        let parsed = await response.json()
        return parsed

    } catch (error) {
        console.error(error)
    }

    return { message: "failed" }

}


export default function AddContact() {

    let [status, setStatus] = useState("")
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [mentions, setMentions] = useState("")
    let [saving, setSaving] = useState(false)
    let [savingTextInfo, setSavingTextInfo] = useState("")
    let [raw_text, setRawText] = useState("")
    let [url, setUrl] = useState("")
    let [statusList, setStatusList] = useState<ParsedText[]>([])
    let [nameList, setNameList] = useState<ParsedText[]>([])
    let [extension, setExtension] = useState(true)

    useEffect(() => {

        chrome.storage.local.get(['parsedText', 'pageUrl'], function (items) {

            if (items.pageUrl && items.parsedText == null) {
                findContactByColumn("url", items.pageUrl).then((data) => {
                    if (data.length > 0) {
                        let parsedText = data[0]
                        setRawText(parsedText.raw_text)
                        setUrl(parsedText.url)
                        setStatus(parsedText.status)
                        setName(parsedText.name)
                        setEmail(parsedText.email)
                        setPhone(parsedText.phone)
                        setMentions(parsedText.mentions)
                    }
                })
            }

        })

    }, [])


    useEffect(() => {

        chrome.storage.local.get(['parsedText'], function (items) {
            if (items.parsedText != null) {
                let parsedText = items.parsedText
                setRawText(parsedText.raw_text)
                setUrl(parsedText.url)
                setStatus(parsedText.status)
                setName(parsedText.name)
                setEmail(parsedText.email)
                setPhone(parsedText.phone)
                setMentions(parsedText.mentions)
            }

        })

    }, [])


    useEffect(() => {

        if (name.length > 0) {
            findContactByColumn("name", name).then((data) => {
                setNameList(data)
            })
        }

        if (status.length > 0) {
            findContactByColumn("status", status).then((data) => {
                setStatusList(data)
            })
        }

    }, [name, status])


    useEffect(() => {
        chrome.storage.sync.get(['extension'], function (items) {
            if (typeof items.extension == "boolean") {
                setExtension(items.extension)
            }
        })
    }, [extension])


    function toggleExtension(e: { preventDefault: () => void }) {
        e.preventDefault()
        setExtension(!extension)
        chrome.storage.sync.set({ 'extension': !extension })
    }

    function clearForm(e: { preventDefault: () => void }) {
        e.preventDefault()

        setRawText("")
        setUrl("")
        setStatus("")
        setName("")
        setEmail("")
        setPhone("")
        setMentions("")

        chrome.storage.local.set({ 'parsedText': null })
        chrome.storage.local.set({ 'pageUrl': null })

    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        setSaving(true)
        setSavingTextInfo("Saving data..")

        let payload: ParsedText = {
            raw_text: raw_text,
            status: status || "new",
            name: name,
            email: email,
            phone: phone,
            mentions: mentions,
            url: url,
        }

        saveContact(payload).then(response => {

            setSaving(false)

            if (response.message == "success") {
                setSavingTextInfo("Data saved!")
                clearForm(event)
            } else {
                setSavingTextInfo("Failed to save data! Check if you have the server running.")
                setTimeout(() => setSavingTextInfo(""), 5000)
            }
        })

    }


    return <div>

        <div style={{ display: "flex", justifyContent: "end" }}>
            <a href="#" onClick={clearForm}>Clear form</a>
            <a style={{ marginLeft: "1rem" }} href="#" onClick={toggleExtension}>
                {
                    extension ? "Disable extension" : "Enable extension"
                }
            </a>
        </div>

        {
            extension ?
                <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>

                    <label>
                        <strong>Selected</strong>
                        <textarea spellCheck={false} name="raw_text" value={raw_text} onChange={e => setRawText(e.target.value)}></textarea>
                    </label>

                    <label>
                        <strong>Name</strong>
                        <input list="names" type="text" name="name" value={name} onChange={e => {
                            setName(e.target.value)
                            const selectedItem = nameList.find(item => item.name === e.target.value)
                            if (selectedItem) {
                                setRawText(selectedItem.raw_text)
                                setUrl(selectedItem.url)
                                setStatus(selectedItem.status)
                                setEmail(selectedItem.email)
                                setPhone(selectedItem.phone)
                                setMentions(selectedItem.mentions)
                                chrome.storage.local.set({ 'parsedText': selectedItem })
                            }
                        }} />
                        <datalist id="names">
                            {nameList.map((item: ParsedText, index: number) => (
                                <option key={index} value={item.name} />
                            ))}
                        </datalist>
                    </label>

                    <label>
                        <strong>Email</strong>
                        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>

                    <label>
                        <strong>Phone</strong>
                        <input type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                    </label>

                    <label>
                        <strong>Status</strong>
                        <input list="statuses" type="text" name="status" value={status} onChange={e => setStatus(e.target.value)} />
                        <datalist id="statuses">
                            {statusList.map((item: ParsedText, index: number) => (
                                <option key={index} value={item.status} />
                            ))}
                        </datalist>
                    </label>

                    <label>
                        <strong>Mentions</strong>
                        <textarea name="mentions" value={mentions} onChange={e => setMentions(e.target.value)}></textarea>
                    </label>

                    <label>
                        <strong>Url</strong>
                        <input type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} />
                    </label>

                    <footer style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
                        <button type='submit' disabled={saving}>ADD CONTACT</button>
                    </footer>
                    <small style={{ marginTop: "-10px", color: "grey" }}>{savingTextInfo}</small>
                </form> : <p>Click enable extension and reload page in order to get data.</p>
        }


    </div>

}