import { useEffect, useState } from 'react'


type RawData = {
    text: string
    source: string
}

async function parseSelectedText(data: RawData) {

    try {

        let response = await fetch("http://localhost:4520/parse-text", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Accept": "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            let parsed = await response.json()
            return parsed
        }

    } catch (error) {
        console.error(error)
    }

    alert("Check if server is running on port 4520!")

}


export default function Modal() {

    let [modalOn, setModalState] = useState(false)
    let [selectedText, setSelectedText] = useState("")
    let [status, setStatus] = useState("")
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [mentions, setMentions] = useState("")

    useEffect(() => {

        async function rightClickModalHandler(event: MouseEvent) {

            if (modalOn) return

            const rawSelectedText = window.getSelection()?.toString()
            if (!rawSelectedText) return

            setSelectedText(rawSelectedText)

            event.preventDefault()

            const styleElem = document.createElement("style")
            styleElem.setAttribute("id", "contact-info-custom-style")
            styleElem.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

dialog {
    font-size: 16px;
    font-family: "Poppins", 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
`
            const linkElem = document.createElement("link")
            linkElem.setAttribute("id", "contact-info-custom-css-library")
            linkElem.setAttribute("rel", "stylesheet")
            linkElem.setAttribute("href", "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css")

            document.head.appendChild(linkElem)
            document.head.appendChild(styleElem)


            let parsedSelected = await parseSelectedText({
                text: rawSelectedText,
                source: document.location.href
            })

            console.log("parsed:", parsedSelected)

            setModalState(true)
            setStatus(parsedSelected.status)
            setName(parsedSelected.name)
            setEmail(parsedSelected.email)
            setPhone(parsedSelected.phone)
            setMentions(parsedSelected.mentions)

        }

        document.addEventListener('contextmenu', rightClickModalHandler)

        return () => {
            document.removeEventListener('contextmenu', rightClickModalHandler)
        }

    }, [])

    function closeModal() {
        document.getElementById("contact-info-custom-style")?.remove()
        document.getElementById("contact-info-custom-css-library")?.remove()
        setModalState(false)
    }


    async function handleSubmit(event: any) {
        event.preventDefault()

        let payload = {
            status: status.toLowerCase(),
            name: name,
            email: email.toLowerCase(),
            phone: phone,
            mentions: mentions,
            source: document.location.href
        }

        console.log("TODO save payload", payload)

    }

    function handleNameChange(value: string) {
        console.log(value)
        setName(value)
    }

    function handleEmailChange(value: string) {
        console.log(value)
        setEmail(value)
    }

    function handlePhoneChange(value: string) {
        console.log(value)
        setPhone(value)
    }

    function handleStatusChange(value: string) {
        console.log(value)
        setStatus(value)
    }

    function handleMentionsChange(value: string) {
        console.log(value)
        setMentions(value)
    }


    return (

        <dialog open={modalOn}>
            <article>

                <h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>Contact info</h3>
                <p style={{ color: "grey" }}>
                    Fields will be updated automatically.
                    Please correct inconsistencies if any.
                    <br />
                    Source: {document.location.href}
                </p>

                <strong style={{ display: "block", marginBottom: "0.2rem", marginTop: "2rem" }}>
                    Selected
                </strong>

                <p style={{ fontSize: "18px", color: "brown" }}>
                    {selectedText}
                </p>

                <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>

                    <label>
                        <strong>Name</strong>
                        <input type="text" name="name" value={name} onChange={e => handleNameChange(e.target.value)} />
                    </label>

                    <div className='grid'>

                        <label>
                            <strong>Email</strong>
                            <input type="email" name="email" value={email} onChange={e => handleEmailChange(e.target.value)} />
                        </label>

                        <label>
                            <strong>Phone</strong>
                            <input type="text" name="phone" value={phone} onChange={e => handlePhoneChange(e.target.value)} />
                        </label>

                    </div>

                    <label>
                        <strong>Status</strong>
                        <input type="text" name="status" value={status} onChange={e => handleStatusChange(e.target.value)} />
                    </label>


                    <label>
                        <strong>Mentions</strong>
                        <textarea name="mentions" value={mentions} onChange={e => handleMentionsChange(e.target.value)}></textarea>
                    </label>

                    <footer style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                        <button type='submit'>SAVE CHANGES</button>
                        <button type='button' className="secondary" onClick={closeModal}>
                            CLOSE
                        </button>
                    </footer>

                </form>

            </article>

        </dialog >

    )
}