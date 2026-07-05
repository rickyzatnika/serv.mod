import { setUser } from "../../data"
import { parse } from "querystring"

const ADMIN_TOKEN = "admin123"

export default function AddResult({ username, expired, error }) {
  if (error) {
    return (
      <html><body style={{ fontFamily: "sans-serif", padding: 40, background: "#f0f2f5" }}>
        <div style={{ maxWidth: 400, margin: "40px auto", background: "white", padding: 30, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ color: "#e74c3c" }}>Gagal</h2><p>{error}</p>
          <br /><a href="/panel" style={{ display: "inline-block", padding: "10px 24px", background: "#667eea", color: "white", textDecoration: "none", borderRadius: 8 }}>Kembali</a>
        </div>
      </body></html>
    )
  }
  return (
    <html><body style={{ fontFamily: "sans-serif", padding: 40, background: "#f0f2f5" }}>
      <div style={{ maxWidth: 400, margin: "40px auto", background: "white", padding: 30, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h2 style={{ color: "#27ae60" }}>Lisensi Ditambahkan</h2>
        <p><strong>{username}</strong> aktif sampai <strong>{expired}</strong></p>
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
        return resolve({ props: { error: "Unauthorized" } })
      }
      const username = params.username
      const password = params.password
      const hwid = params.hwid || ""
      const days = parseInt(params.days) || 30
      const expired = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
      await setUser(username, {
        password,
        hwid,
        expired,
        created: new Date().toISOString().slice(0, 19).replace("T", " ")
      })
      resolve({ props: { username, expired } })
    })
  })
}
