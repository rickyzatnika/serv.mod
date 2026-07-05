import { deleteUser } from "../../data"
import { parse } from "querystring"

const ADMIN_TOKEN = "admin123"

export default function DeleteResult({ deleted }) {
  return (
    <html><body style={{ fontFamily: "sans-serif", padding: 40, background: "#f0f2f5" }}>
      <div style={{ maxWidth: 400, margin: "40px auto", background: "white", padding: 30, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h2 style={{ color: deleted ? "#27ae60" : "#e74c3c" }}>{deleted ? "Dihapus" : "Gagal"}</h2>
        <br /><a href="/panel" style={{ display: "inline-block", padding: "10px 24px", background: "#667eea", color: "white", textDecoration: "none", borderRadius: 8 }}>Kembali ke Panel</a>
      </div>
    </body></html>
  )
}

export async function getServerSideProps({ req }) {
  return new Promise(resolve => {
    let body = ""
    req.on("data", chunk => { body += chunk })
    req.on("end", async () => {
      const params = parse(body)
      const token = params.admin_token
      if (token !== ADMIN_TOKEN) {
        return resolve({ props: { deleted: false } })
      }
      const username = params.username
      const existed = await deleteUser(username)
      resolve({ props: { deleted: !!existed } })
    })
  })
}
