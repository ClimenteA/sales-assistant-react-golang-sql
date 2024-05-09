import { useState, FormEvent, useEffect } from 'react'
import { ParsedText, headers, PORT } from "./common"


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

  alert(`Check if server is running on port ${PORT}!`)

}


export default function App() {

  let [status, setStatus] = useState("")
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [phone, setPhone] = useState("")
  let [mentions, setMentions] = useState("")
  let [saving, setSaving] = useState(false)
  let [savingTextInfo, setSavingTextInfo] = useState("")
  let [raw_text, setRawText] = useState("")
  let [url, setUrl] = useState("")

  useEffect(() => {

    chrome.storage.local.get(['parsedText'], function (items) {
      if (items.parsedText) {
        let parsedText: ParsedText = items.parsedText

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


  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    setSaving(true)
    setSavingTextInfo("Saving data..")

    let payload: ParsedText = {
      raw_text: raw_text,
      status: status.toLowerCase(),
      name: name,
      email: email.toLowerCase(),
      phone: phone,
      mentions: mentions,
      url: document.location.href,
    }

    saveContact(payload).then(response => {

      setSaving(false)

      if (response.message == "success") {
        setSavingTextInfo("Data saved!")
      } else {
        setSavingTextInfo("Failed to save data! Check if you have the server running.")
        setTimeout(() => setSavingTextInfo(""), 5000)
      }
    })

  }


  return (

    <main style={{ width: "600px", paddingTop: "1rem", paddingBottom: "2rem", marginLeft: "20px", marginRight: "20px" }}>

      <h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>Contact info</h3>
      <p style={{ color: "grey" }}>
        Fields will be updated automatically.
        Please correct inconsistencies if any.
        <br />
        Source: {url}
      </p>

      <strong style={{ display: "block", marginBottom: "0.2rem", marginTop: "2rem" }}>
        Selected
      </strong>

      <p style={{ fontSize: "18px", color: "lightcoral" }}>
        {raw_text}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>

        <label>
          <strong>Name</strong>
          <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
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
          <input type="text" name="status" value={status} onChange={e => setStatus(e.target.value)} />
        </label>


        <label>
          <strong>Mentions</strong>
          <textarea name="mentions" value={mentions} onChange={e => setMentions(e.target.value)}></textarea>
        </label>

        <footer style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
          <button type='submit' disabled={saving}>SAVE CONTACT</button>
        </footer>
        <small style={{ marginTop: "-10px", color: "grey" }}>{savingTextInfo}</small>
      </form>

    </main>

  )
}
