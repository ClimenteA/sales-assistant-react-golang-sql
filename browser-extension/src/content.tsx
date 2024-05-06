import React from "react";
import ReactDOM from "react-dom/client"
import Modal from "./Modal"

const root = document.createElement("div")
root.id = "crx-root"
document.body.appendChild(root)

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Modal />
    </React.StrictMode>
)