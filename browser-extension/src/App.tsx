import { useState, FormEvent, useEffect } from 'react'
import { ParsedText, headers, PORT } from "./common"


async function saveContact(data: ParsedText) {

	try {

		let response = await fetch(`http://localhost:${PORT}/save-contact`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: headers
		})

		let parsed = await response.json()
		return parsed

	} catch (error) {
		console.error(error)
	}

	alert(`Check if server is running on port ${PORT}!`)

}



async function findContactByColumn(column: string, value: string) {

	try {

		let response = await fetch(`http://localhost:${PORT}/find-contact`, {
			method: "POST",
			body: JSON.stringify({ column, value }),
			headers: headers
		})

		let parsed = await response.json()
		console.log(parsed)
		return parsed

	} catch (error) {
		console.error(error)
	}

	alert(`Check if server is running on port ${PORT}!`)

}



async function triggerExportDataToDownloads() {

	try {

		let response = await fetch(`http://localhost:${PORT}/export-tables`, {
			method: "POST",
			headers: headers
		})

		let parsed = await response.json()
		console.log(parsed)
		return parsed

	} catch (error) {
		console.error(error)
	}

	alert(`Check if server is running on port ${PORT}!`)

}


async function triggerImportDataToDownloads() {

	try {

		let response = await fetch(`http://localhost:${PORT}/import-tables`, {
			method: "POST",
			headers: headers
		})

		let parsed = await response.json()
		console.log(parsed)
		return parsed

	} catch (error) {
		console.error(error)
	}

	alert(`Check if server is running on port ${PORT}!`)

}


export default function App() {

	let [status, setStatus] = useState("")
	let [name, setName] = useState("")
	let [email, setEmail] = useState("")
	let [phone, setPhone] = useState("")
	let [mentions, setMentions] = useState("")
	let [saving, setSaving] = useState(false)
	let [savingTextInfo, setSavingTextInfo] = useState("")
	let [raw_text, setRawText] = useState("")
	let [url, setUrl] = useState("")
	let [statusList, setStatusList] = useState<ParsedText[]>([])
	let [nameList, setNameList] = useState<ParsedText[]>([])
	let [exportData, setExportData] = useState(false)
	let [exportDataText, setExportDataText] = useState("Export data to CSV's")
	let [importData, setImportData] = useState(false)
	let [importDataText, setImportDataText] = useState("Import data from CSV's")


	useEffect(() => {

		chrome.storage.local.get(['parsedText', 'pageUrl'], function (items) {

			if (items.pageUrl && items.parsedText == null) {
				findContactByColumn("url", items.pageUrl).then((data) => {
					if (data.length > 0) {
						let parsedText = data[0]
						setRawText(parsedText.raw_text)
						setUrl(parsedText.url)
						setStatus(parsedText.status)
						setName(parsedText.name)
						setEmail(parsedText.email)
						setPhone(parsedText.phone)
						setMentions(parsedText.mentions)
					}
				})
			}

		})

	}, [])


	useEffect(() => {

		chrome.storage.local.get(['parsedText'], function (items) {
			if (items.parsedText != null) {
				let parsedText = items.parsedText
				setRawText(parsedText.raw_text)
				setUrl(parsedText.url)
				setStatus(parsedText.status)
				setName(parsedText.name)
				setEmail(parsedText.email)
				setPhone(parsedText.phone)
				setMentions(parsedText.mentions)
			}

		})

	}, [])


	useEffect(() => {

		if (name.length > 0) {
			findContactByColumn("name", name).then((data) => {
				setNameList(data)
			})
		}

		if (status.length > 0) {
			findContactByColumn("status", status).then((data) => {
				setStatusList(data)
			})
		}

	}, [name, status])


	function handleSubmit(event: FormEvent) {
		event.preventDefault()

		setSaving(true)
		setSavingTextInfo("Saving data..")

		let payload: ParsedText = {
			raw_text: raw_text,
			status: status.toLowerCase(),
			name: name,
			email: email.toLowerCase(),
			phone: phone,
			mentions: mentions,
			url: url,
		}

		saveContact(payload).then(response => {

			setSaving(false)

			if (response.message == "success") {
				setSavingTextInfo("Data saved!")

				setRawText("")
				setUrl("")
				setStatus("")
				setName("")
				setEmail("")
				setPhone("")
				setMentions("")

				chrome.storage.local.set({ 'parsedText': null })
				chrome.storage.local.set({ 'pageUrl': null })

			} else {
				setSavingTextInfo("Failed to save data! Check if you have the server running.")
				setTimeout(() => setSavingTextInfo(""), 5000)
			}
		})

	}


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

		<main style={{ width: "600px", paddingTop: "1rem", paddingBottom: "2rem", marginLeft: "20px", marginRight: "20px" }}>

			<h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>Contact info</h3>
			<p style={{ color: "grey" }}>
				Select text and right click.
				Fields will be updated automatically.
				Please correct inconsistencies if any.
				You can also add a contact without selecting a text just by filling the fields.
			</p>

			<div style={{ display: "flex", justifyContent: "end" }}>
				<a href="#" aria-disabled={exportData} onClick={triggerExportData}>{exportDataText}</a>
				<a style={{ marginLeft: "1rem" }} href="#" aria-disabled={importData} onClick={triggerImportData}>{importDataText}</a>
			</div>

			<strong style={{ display: "block", marginBottom: "0.2rem", marginTop: "2rem" }}>
				Selected
			</strong>

			<p style={{ fontSize: "18px", color: "lightcoral" }}>
				{raw_text}
			</p>

			<form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>

				<label>
					<strong>Url</strong>
					<input type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} />
				</label>

				<label>
					<strong>Name</strong>
					<input list="names" type="text" name="name" value={name} onChange={e => {
						setName(e.target.value)
						const selectedItem = nameList.find(item => item.name === e.target.value)
						if (selectedItem) {
							setRawText(selectedItem.raw_text)
							setUrl(selectedItem.url)
							setStatus(selectedItem.status)
							setEmail(selectedItem.email)
							setPhone(selectedItem.phone)
							setMentions(selectedItem.mentions)
							chrome.storage.local.set({ 'parsedText': selectedItem })
						}
					}} />
					<datalist id="names">
						{nameList.map((item: ParsedText, index: number) => (
							<option key={index} value={item.name} />
						))}
					</datalist>
				</label>

				<label>
					<strong>Email</strong>
					<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
				</label>

				<label>
					<strong>Phone</strong>
					<input type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)} />
				</label>

				<label>
					<strong>Status</strong>
					<input list="statuses" type="text" name="status" value={status} onChange={e => setStatus(e.target.value)} />
					<datalist id="statuses">
						{statusList.map((item: ParsedText, index: number) => (
							<option key={index} value={item.status} />
						))}
					</datalist>
				</label>

				<label>
					<strong>Mentions</strong>
					<textarea name="mentions" value={mentions} onChange={e => setMentions(e.target.value)}></textarea>
				</label>

				<footer style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
					<button type='submit' disabled={saving}>SAVE CONTACT</button>
				</footer>
				<small style={{ marginTop: "-10px", color: "grey" }}>{savingTextInfo}</small>
			</form>

		</main>

	)
}
