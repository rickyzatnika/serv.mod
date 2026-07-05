import { getUser, logRequest } from "../../data"

export default async function handler(req, res) {
  const username = req.query?.user || req.body?.user || req.body?.username || ""
  const token = req.query?.token || req.headers["authorization"] || ""

  await logRequest("/api/status", username, "", req.socket?.remoteAddress || "")

  const user = await getUser(username)
  if (!user) {
    return res.json({
      status: "error",
      result: "inactive",
      message: "User not found"
    })
  }

  const expired = user.expired || ""
  const now = new Date().toISOString().slice(0, 10)
  const isActive = expired >= now

  const remaining = isActive
    ? Math.ceil((new Date(expired) - new Date()) / (1000 * 60 * 60 * 24))
    : 0

  res.json({
    status: "success",
    result: isActive ? "active" : "expired",
    message: isActive ? "Aktif" : "Expired",
    data: { username, expired, remaining_days: remaining }
  })
}
