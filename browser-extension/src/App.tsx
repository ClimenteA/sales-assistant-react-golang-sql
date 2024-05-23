import { useState, useEffect } from 'react'
import { serverIsOnline } from './common'

import AddContact from "./AddContact"
import Contacts from './Contacts'



export default function App() {
	let [contactRoute, setContactRoute] = useState(true)
	let [serverOnline, setServerOnline] = useState(true)

	useEffect(() => {
		serverIsOnline().then(res => {
			if (res.message == "failed") {
				setServerOnline(false)
			}
		})
	}, [])

	return (

		<main style={{ width: "600px", paddingTop: "1rem", paddingBottom: "2rem", marginLeft: "20px", marginRight: "20px" }}>

			{
				serverOnline ?
					<div>
						<header>

							<a onClick={() => setContactRoute(!contactRoute)} style={{ cursor: "pointer", userSelect: "none" }}>
								<h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>
									<svg style={{ width: "24px", height: "24px", marginRight: "10px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
									</svg>
									<span>{contactRoute ? "Add Contact" : "Saved Contacts"}</span>
								</h3>
							</a>

							{
								contactRoute ?

									<p style={{ color: "grey" }}>
										Select text and right click.
										Fields will be updated automatically.
										Please correct inconsistencies if any.
										You can also add a contact without selecting a text just by filling the fields.
									</p> :

									<p style={{ color: "grey" }}>
										Here is a list of all saved contacts.
										Click on a contact to modify it.
										You can also use the filter by column value to narrow down the results.
									</p>

							}

						</header>

						{contactRoute ? <AddContact /> : <Contacts />}

					</div>

					:

					<p style={{ color: "lightcoral" }}>
						Please start binary server. Checkout documentation received.
					</p>

			}

		</main>

	)
}
