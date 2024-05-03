"use strict"


const { article, button, dialog, div, footer, form, h3, input, label, p, strong } = van.tags



function ModalForm(text) {

    const modalIsOpen = van.state("open")
    const status = van.state(text.status)
    const tags = van.state(text.tags)
    const name = van.state(text.name)
    const email = van.state(text.email)
    const phone = van.state(text.phone)
    const source = van.state(text.source)


    const styleElem = document.createElement("style")
    styleElem.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

dialog {
    font-size: 16px;
    font-family: "Poppins", 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
`
    const linkElem = document.createElement("link")
    linkElem.setAttribute("rel", "stylesheet")
    linkElem.setAttribute("href", "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css")

    document.head.appendChild(linkElem)
    document.head.appendChild(styleElem)

    document.body.style.overflow = "hidden"

    function closeModal() {
        document.head.removeChild(linkElem)
        document.head.removeChild(styleElem)
        modalIsOpen.val = ""
        document.body.style.overflow = ""
    }

    function saveData() {

        const data = {
            text: text.val,
            status: status.val,
            tags: tags.val,
            name: name.val,
            email: email.val,
            phone: phone.val,
            source: source.val
        }

        console.log("save data")
        console.log(data)

    }

    return div(
        dialog({ open: modalIsOpen.val, id: "sp-modal" },
            article(
                h3({ style: "font-weight: bold; margin-top: 1rem;" },
                    "Add/Update prospect",
                ),
                p({ style: "color: grey;" },
                    "Fields will be updated automatically. Please correct inconsistencies if any.",
                ),
                div({ style: "margin-top: 2rem;" },
                    strong({ style: "display: block; margin-bottom: 0.2rem;" },
                        "Selected",
                    ),
                    p({ style: "font-size: 18px;" },
                        text.text,
                    ),
                    form({ style: "margin-top: 2rem;" },
                        label(
                            strong(
                                "Status",
                            ),
                            input({ type: "text", spellcheck: "false", name: "status", value: status.val, oninput: e => status.val = e.target.value }),
                        ),
                        label(
                            strong(
                                "Tags",
                            ),
                            input({ type: "text", spellcheck: "false", name: "tags", value: tags.val, oninput: e => tags.val = e.target.value }),
                        ),
                        label(
                            strong(
                                "Name",
                            ),
                            input({ autocomplete: "off", spellcheck: "false", type: "text", name: "name", value: name.val, oninput: e => name.val = e.target.value }),
                        ),
                        label(
                            strong(
                                "Email",
                            ),
                            input({ autocomplete: "off", spellcheck: "false", type: "email", name: "email", value: email.val, oninput: e => email.val = e.target.value }),
                        ),
                        label(
                            strong(
                                "Phone",
                            ),
                            input({ autocomplete: "off", spellcheck: "false", type: "text", name: "phone", value: phone.val, oninput: e => phone.val = e.target.value }),
                        ),
                        label(
                            strong(
                                "Source",
                            ),
                            input({ autocomplete: "off", spellcheck: "false", type: "text", name: "tags", value: source.val, oninput: e => source.val = e.target.value }),
                        ),
                    ),
                ),
                footer(
                    button(
                        { onclick: saveData },
                        "SAVE CHANGES"
                    ),
                    button({ class: "secondary", onclick: closeModal },
                        "CLOSE",
                    ),
                ),
            ),
        ),
    )
}


document.addEventListener('contextmenu', async function (event) {
    event.preventDefault()
    const selectedText = window.getSelection().toString()
    if (!selectedText) {
        alert("No text selected!")
        return
    }

    const data = {
        text: selectedText,
        source: document.location.host
    }

    chrome.storage.sync.set({ 'selected': data })

    chrome.runtime.sendMessage('parseSelected', (response) => {
        van.add(document.body, ModalForm(response))
    })

})


