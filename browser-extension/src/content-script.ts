
type RawText = {
    text: string
    source: string
}


async function parseSelectedText(data: RawText) {

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



document.addEventListener('contextmenu', async function (event) {

    const selectedText = window?.getSelection()?.toString()
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

        // if (parsedSelected) {
        //     van.add(document.body, ModalForm(parsedSelected))
        // }

    }

})


