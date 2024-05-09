import { RawData, headers, PORT } from "./common"


async function parseRawRext(data: RawData) {

    try {

        let response = await fetch(`http://localhost:${PORT}/parse-text`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers
        })

        if (response.ok) {
            let parsed = await response.json()
            return parsed
        }

    } catch (error) {
        console.error(error)
    }

    alert(`Check if server is running on port ${PORT}!`)

}


function rightClickModalHandler(event: MouseEvent) {

    const raw_text = window.getSelection()?.toString()
    if (!raw_text) return

    event.preventDefault()

    parseRawRext({
        raw_text: raw_text,
        url: document.location.href,
    }).then(parsedText => {
        console.log("parsed:", parsedText)
        chrome.storage.local.set({ 'parsedText': parsedText })
        window.getSelection()?.removeAllRanges()
    })

}


document.addEventListener('contextmenu', rightClickModalHandler)
