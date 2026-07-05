import { getAllUsers, getLogs } from "../data"

const ADMIN_TOKEN = "admin123"

export default function Panel({ users, logs, now, authed, error, success, deleted }) {
  if (!authed) {
    return (
      <html>
        <head>
          <title>MOD License Panel - Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>{`
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:system-ui,-apple-system,sans-serif; background:linear-gradient(135deg,#667eea,#764ba2); min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
            .card { background:white; border-radius:16px; padding:32px; width:100%; max-width:400px; box-shadow:0 10px 40px rgba(0,0,0,0.15); text-align:center; }
            h1 { font-size:24px; margin-bottom:24px; color:#333; }
            input { width:100%; padding:12px 16px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px; margin-bottom:12px; outline:none; }
            input:focus { border-color:#667eea; }
            button { width:100%; padding:12px; background:#667eea; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; }
            button:hover { background:#5a6fd6; }
            .error { color:#e74c3c; font-size:13px; margin-top:8px; }
          `}</style>
        </head>
        <body>
          <div className="card">
            <h1>MOD License Panel</h1>
            {error === "invalid_token" && <p className="error">Token salah!</p>}
            <form method="POST" action="/api/login-panel">
              <input type="password" name="token" placeholder="Masukkan Token Admin" required />
              <button type="submit">Masuk</button>
            </form>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html>
      <head>
        <title>MOD License Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:system-ui,-apple-system,sans-serif; background:linear-gradient(135deg,#667eea,#764ba2); min-height:100vh; padding:20px; color:#333; }
          .container { max-width:800px; margin:0 auto; }
          .card { background:white; border-radius:16px; padding:24px; margin-bottom:20px; box-shadow:0 10px 40px rgba(0,0,0,0.15); }
          h1 { color:white; text-align:center; margin-bottom:24px; font-size:28px; }
          h2 { font-size:18px; margin-bottom:16px; color:#667eea; }
          .toast { padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:14px; font-weight:500; }
          .toast-success { background:#27ae6020; color:#27ae60; border:1px solid #27ae60; }
          .toast-error { background:#e74c3c20; color:#e74c3c; border:1px solid #e74c3c; }
          input, button { width:100%; padding:12px 16px; border-radius:8px; font-size:14px; margin-bottom:8px; }
          input { border:2px solid #e0e0e0; outline:none; }
          input:focus { border-color:#667eea; }
          button { background:#667eea; color:white; border:none; cursor:pointer; font-weight:600; }
          button:hover { background:#5a6fd6; }
          .btn-danger { background:#e74c3c; }
          .btn-danger:hover { background:#c0392b; }
          .btn-success { background:#27ae60; }
          .btn-success:hover { background:#219a52; }
          table { width:100%; border-collapse:collapse; }
          th, td { padding:10px 12px; text-align:left; border-bottom:1px solid #eee; font-size:13px; }
          th { color:#667eea; font-weight:600; }
          .badge { display:inline-block; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
          .badge-active { background:#27ae6020; color:#27ae60; }
          .badge-expired { background:#e74c3c20; color:#e74c3c; }
          .logout { float:right; color:white; text-decoration:none; font-size:13px; opacity:0.8; margin-top:8px; display:inline-block; }
          .logout:hover { opacity:1; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>MOD License Server <a href="/panel?logout=1" className="logout">Logout</a></h1>
          {success && <div className="toast toast-success">Lisensi {success} berhasil ditambahkan!</div>}
          {deleted && <div className="toast toast-success">Lisensi berhasil dihapus!</div>}
          {error === "missing_fields" && <div className="toast toast-error">Username & Password wajib diisi!</div>}
          {error === "unauthorized" && <div className="toast toast-error">Token tidak valid!</div>}
          <div className="card">
            <h2>+ Tambah Lisensi Baru</h2>
            <form method="POST" action="/api/admin/add">
              <input type="hidden" name="admin_token" value={ADMIN_TOKEN} />
              <input type="text" name="username" placeholder="Username" required />
              <input type="text" name="password" placeholder="Password" required />
              <input type="text" name="hwid" placeholder="HWID (biarkan kosong)" />
              <input type="number" name="days" placeholder="Masa Aktif (hari)" defaultValue={30} required />
              <button className="btn-success" type="submit">Tambah Lisensi</button>
            </form>
          </div>
          <div className="card">
            <h2>Daftar Lisensi</h2>
            <table>
              <tr><th>Username</th><th>Password</th><th>HWID</th><th>Expired</th><th>Status</th><th>Aksi</th></tr>
              {Object.entries(users).map(([u, data]) => (
                <tr key={u}>
                  <td>{u}</td>
                  <td>{data.password}</td>
                  <td>{data.hwid || "-"}</td>
                  <td>{data.expired}</td>
                  <td>
                    {data.expired && data.expired >= now
                      ? <span className="badge badge-active">Aktif</span>
                      : <span className="badge badge-expired">Expired</span>}
                  </td>
                  <td>
                    <form method="POST" action="/api/admin/delete" style={{ display: "inline" }}>
                      <input type="hidden" name="admin_token" value={ADMIN_TOKEN} />
                      <input type="hidden" name="username" value={u} />
                      <button className="btn-danger" type="submit">Hapus</button>
                    </form>
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div className="card">
            <h2>Log Request</h2>
            <table>
              <tr><th>Waktu</th><th>IP</th><th>Endpoint</th><th>Username</th><th>HWID</th></tr>
              {logs.slice(0, 50).map((log, i) => (
                <tr key={i}>
                  <td>{log.time}</td>
                  <td>{log.ip}</td>
                  <td>{log.endpoint}</td>
                  <td>{log.username}</td>
                  <td>{log.hwid}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </body>
    </html>
  )
}

export async function getServerSideProps({ req, res, query }) {
  const cookies = parseCookies(req.headers.cookie || "")
  let authed = cookies.admin_token === ADMIN_TOKEN
  let error = query.error || null
  const success = query.success || null
  const deleted = query.deleted || null

  if (query.logout === "1") {
    authed = false
    res.setHeader("Set-Cookie", "admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0")
  }

  if (!authed) {
    return { props: { authed: false, error: error === "invalid_token" ? "invalid_token" : null, success: null, deleted: null } }
  }

  try {
    const [users, logs] = await Promise.all([getAllUsers(), getLogs()])
    const now = new Date().toISOString().slice(0, 10)
    return { props: { users, logs, now, authed: true, error, success, deleted } }
  } catch (e) {
    console.error("Panel error:", e)
    return { props: { authed: true, users: {}, logs: [], now: "", error: "server_error", success: null, deleted: null } }
  }
}

function parseCookies(cookie) {
  const obj = {}
  if (!cookie) return obj
  cookie.split(";").forEach((c) => {
    const [k, ...v] = c.trim().split("=")
    if (k) obj[k.trim()] = decodeURIComponent(v.join("="))
  })
  return obj
}
