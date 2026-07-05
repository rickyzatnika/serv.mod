import { setUser } from "../../../data"

const ADMIN_TOKEN = "admin123"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/panel" }).end()
    return
  }

  const { admin_token, username, password, hwid, days } = req.body

  if (admin_token !== ADMIN_TOKEN) {
    res.writeHead(302, { Location: "/panel?error=unauthorized" }).end()
    return
  }

  if (!username || !password) {
    res.writeHead(302, { Location: "/panel?error=missing_fields" }).end()
    return
  }

  const numDays = parseInt(days) || 30
  const expired = new Date(Date.now() + numDays * 86400000).toISOString().slice(0, 10)

  await setUser(username, {
    password,
    hwid: hwid || "",
    expired,
    created: new Date().toISOString().slice(0, 19).replace("T", " ")
  })

  res.writeHead(302, { Location: `/panel?success=${encodeURIComponent(username)}` }).end()
}
