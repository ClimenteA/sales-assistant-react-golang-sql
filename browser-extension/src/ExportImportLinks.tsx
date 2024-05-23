import { useState } from 'react'
import { headers, PORT } from "./common"


async function triggerExportOrImport(route: string) {

    try {

        let response = await fetch(`http://localhost:${PORT}/${route}`, {
            method: "POST",
            headers: headers
        })

        let parsed = await response.json()
        console.log(parsed)
        return parsed

    } catch (error) {
        console.error(error)
    }

    return { message: "failed" }

}


async function triggerExportDataToDownloads() {
    return await triggerExportOrImport("export-tables")
}

async function triggerImportDataToDownloads() {
    return await triggerExportOrImport("import-tables")
}


export default function ExportImportLinks() {

    let [exportData, setExportData] = useState(false)
    let [exportDataText, setExportDataText] = useState("Export data to CSV's")
    let [importData, setImportData] = useState(false)
    let [importDataText, setImportDataText] = useState("Import data from CSV's")


    function triggerExportData(e: { preventDefault: () => void }) {
        e.preventDefault()

        setExportData(true)
        setExportDataText("Data is being exported...")

        triggerExportDataToDownloads().then(res => {
            if (res.message == "data exported") {
                setExportData(false)
                setExportDataText("Data was exported!")
                setTimeout(() => setExportDataText("Export data from CSV's"), 3000)
            } else {
                setExportDataText("Failed to export data. Please check for errors.")
            }
        })

    }


    function triggerImportData(e: { preventDefault: () => void }) {
        e.preventDefault()

        setImportData(true)
        setImportDataText("Data is being imported...")

        triggerImportDataToDownloads().then(res => {
            if (res.message == "data imported") {
                setImportData(false)
                setImportDataText("Data was imported!")
                setTimeout(() => setImportDataText("Import data to CSV's"), 3000)
            } else {
                setImportDataText("Failed to import data. Please check for errors.")
            }
        })

    }

    return (
        <div style={{ display: "flex", justifyContent: "end" }}>
            <a style={{ marginLeft: "1rem" }} href="#" aria-disabled={exportData} onClick={triggerExportData}>{exportDataText}</a>
            <a style={{ marginLeft: "1rem" }} href="#" aria-disabled={importData} onClick={triggerImportData}>{importDataText}</a>
        </div>
    )

}
