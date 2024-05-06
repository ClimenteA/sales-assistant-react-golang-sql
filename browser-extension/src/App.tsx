

export default function App() {

  return (

    <main style={{ marginTop: "1rem" }} className="container">

      <h3>Sales Assistant</h3>

      <p>
        This chrome extension will run on each page while it's active in search for possible contact information.
        Once, found it will prompt you to save it.
        Make sure you have the server accompanion running while doing this.
      </p>

      <div style={{ marginBottom: "2rem" }}>

        <a href="http://localhost:4520" target="_blank" style={{ display: "block" }} role="button">
          View collected prospects
        </a>

      </div>

    </main>

  )
}


