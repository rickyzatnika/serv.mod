import { deleteUser } from "../../../data"

const ADMIN_TOKEN = "admin123"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.writeHead(302, { Location: "/panel" }).end()
    return
  }

  const { admin_token, username } = req.body

  if (admin_token !== ADMIN_TOKEN) {
    res.writeHead(302, { Location: "/panel?error=unauthorized" }).end()
    return
  }

  await deleteUser(username)
  res.writeHead(302, { Location: "/panel?deleted=1" }).end()
}
