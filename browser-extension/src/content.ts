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


function toast() {
    let p = document.createElement("p")
    p.innerText = "Text selected! Now open extension to modify and save it."
    p.style.position = "absolute"
    p.style.top = "20px"
    p.style.left = "20px"
    p.style.height = "60px"
    p.style.backgroundColor = "black"
    p.style.color = "white"
    p.style.padding = "1rem"
    p.style.borderRadius = "8px"
    p.style.zIndex = "calc(infinity)"
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 5000)
}

function rightClickModalHandler(event: MouseEvent) {

    const raw_text = window.getSelection()?.toString()
    if (!raw_text) return

    event.preventDefault()

    parseRawRext({
        raw_text: raw_text,
        url: document.location.href,
    }).then(parsedText => {
        console.log("parsedText:", parsedText)
        chrome.storage.local.set({ 'parsedText': parsedText })
        window.getSelection()?.removeAllRanges()
        toast()
    })

}


document.addEventListener('contextmenu', rightClickModalHandler)
