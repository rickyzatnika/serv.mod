export default function handler(req, res) {
  const ADMIN_TOKEN = "admin123"

  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/panel" }).end()
    return
  }

  const { token } = req.body

  if (token === ADMIN_TOKEN) {
    res.setHeader("Set-Cookie", `admin_token=${ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)
    res.writeHead(302, { Location: "/panel" }).end()
  } else {
    res.writeHead(302, { Location: "/panel?error=invalid_token" }).end()
  }
}
