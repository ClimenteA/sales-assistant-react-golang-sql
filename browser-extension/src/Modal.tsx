import { useRef, useEffect } from 'react'


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
    const ref = useRef(null)

    useEffect(() => {

        const element = ref.current

        async function rightClickModalHandler(event) {

            const selectedText = window.getSelection()?.toString()
            if (!selectedText) return

            let modalVisible = document.getElementById("sp-modal") ? true : false

            if (modalVisible === false) {

                event.preventDefault()

                const data = {
                    text: selectedText,
                    source: document.location.href
                }

                let parsedSelected = await parseSelectedText(data)

                console.log(parsedSelected)

                if (parsedSelected) {
                    console.log("todo")
                }

            }

        }

        document.addEventListener('contextmenu', rightClickModalHandler)

        return () => {
            document.removeEventListener('contextmenu', rightClickModalHandler)
        }

    }, [])

    return (
        <div>
            <button ref={ref}>Click</button>
        </div>
    )
}