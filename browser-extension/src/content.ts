import { RawData, headers, PORT, ParsedText } from "./common"


async function parseRawRext(data: RawData) {

    try {

        let response = await fetch(`http://localhost:${PORT}/parse-text`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers
        })

        if (response.ok) {
            let parsed: ParsedText = await response.json()
            return parsed
        }

    } catch (error) {
        console.error(error)
    }

    alert(`Check if server is running on port ${PORT}!`)

}


function removeAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}



function rightClickModalHandler(event: MouseEvent) {

    let raw_text = window.getSelection()?.toString()
    if (!raw_text) return

    event.preventDefault()

    parseRawRext({
        raw_text: removeAccents(raw_text),
        url: document.location.href,
    }).then(parsedText => {
        console.log("parsedText:", parsedText)
        if (parsedText) {
            navigator.clipboard.writeText(parsedText.raw_text)
        }
        chrome.storage.local.set({ 'parsedText': parsedText })
        window.getSelection()?.removeAllRanges()
        let p = document.createElement("p")
        p.innerText = "Text selected! Now open extension to modify and save it."
        p.style.position = "fixed"
        p.style.top = "20px"
        p.style.left = "20px"
        p.style.height = "60px"
        p.style.backgroundColor = "black"
        p.style.color = "white"
        p.style.padding = "1rem"
        p.style.borderRadius = "8px"
        p.style.zIndex = "calc(infinity)"
        p.style.fontSize = "16px !important"
        document.body.appendChild(p)
        setTimeout(() => p.remove(), 5000)
    })

}


chrome.storage.local.set({ 'pageUrl': document.location.href })
chrome.storage.local.set({ 'parsedText': null })

document.addEventListener('contextmenu', rightClickModalHandler)
