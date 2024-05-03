
async function parseSelectedText(data) {

    let response = await fetch("http://localhost:3000/parse-text", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json"
        }
    })

    console.log("response.ok: ", response.ok)

    if (response.ok) {
        let parsed = await response.json()
        return parsed
    }

}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'parseSelected') {
        chrome.storage.sync.get(['selected'], async function (items) {
            let parsedSelected = await parseSelectedText(items.selected)
            sendResponse(parsedSelected)
        })
    }
})

