import { getAllUsers } from "../../../data"

const ADMIN_TOKEN = "admin123"

export default async function handler(req, res) {
  const token = req.query?.token || ""
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "unauthorized" })
  }
  const users = await getAllUsers()
  res.json(users)
}
