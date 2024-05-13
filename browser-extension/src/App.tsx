import AddContact from "./AddContact"


export default function App() {

	return (

		<main style={{ width: "600px", paddingTop: "1rem", paddingBottom: "2rem", marginLeft: "20px", marginRight: "20px" }}>

			<header>
				<h3 style={{ fontWeight: "bold", marginTop: "1rem" }}>Contact info</h3>
				<p style={{ color: "grey" }}>
					Select text and right click.
					Fields will be updated automatically.
					Please correct inconsistencies if any.
					You can also add a contact without selecting a text just by filling the fields.
				</p>
			</header>

			<AddContact />

		</main>

	)
}
