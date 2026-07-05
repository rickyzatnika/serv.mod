export default function handler(req, res) {
  const ADMIN_TOKEN = "admin123"

  if (req.method !== "POST") {
    res.redirect("/panel")
    return
  }

  const { token } = req.body

  if (token === ADMIN_TOKEN) {
    res.setHeader("Set-Cookie", `admin_token=${ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)
    res.redirect("/panel")
  } else {
    res.redirect("/panel?error=1")
  }
}
