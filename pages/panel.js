import { getAllUsers, getLogs } from "../data"

const ADMIN_TOKEN = "admin123"

export default function Panel({ users, logs, now }) {
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
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>&#9881; MOD License Server</h1>
          <div className="card">
            <h2>+ Tambah Lisensi Baru</h2>
            <form method="POST" action="/admin/add">
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
                    <form method="POST" action="/admin/delete" style={{ display: "inline" }}>
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

export async function getServerSideProps() {
  const [users, logs] = await Promise.all([getAllUsers(), getLogs()])
  const now = new Date().toISOString().slice(0, 10)
  return { props: { users, logs, now } }
}
