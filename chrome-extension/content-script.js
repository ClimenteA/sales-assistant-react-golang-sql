// const { button, div } = van.tags
// van.add(document.body, Hello())



document.addEventListener('contextmenu', function (event) {
    event.preventDefault()
    const text = window.getSelection().toString()
    if (!text) {
        alert("No text selected!")
        return
    }
    console.log(document.location.host)
    console.log(document.location.href)
    console.log(text)




    alert(text)
})