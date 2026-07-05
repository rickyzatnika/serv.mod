import crypto from "crypto"
import { getUser, logRequest } from "../../data"

export default async function handler(req, res) {
  const username = req.body?.u || req.body?.username || ""
  const password = req.body?.p || req.body?.password || ""
  const hwid = req.body?.hwid || req.body?.device || ""
  const signature = req.body?.signature || req.headers["x-signature"] || ""
  const timestamp = req.body?.timestamp || req.headers["x-timestamp"] || ""

  await logRequest("/api/login", username, hwid, req.socket?.remoteAddress || "")

  const user = await getUser(username)
  if (!user) {
    return res.status(401).json({
      status: "error",
      result: "error",
      message: "Username atau password salah",
      code: 401
    })
  }

  if (user.password !== password) {
    return res.status(401).json({
      status: "error",
      result: "error",
      message: "Password salah",
      code: 401
    })
  }

  if (user.hwid && user.hwid !== hwid) {
    return res.status(403).json({
      status: "error",
      result: "error",
      message: "HWID tidak valid",
      code: 403
    })
  }

  const expired = user.expired || ""
  const now = new Date().toISOString().slice(0, 10)
  const isExpired = expired < now

  if (isExpired) {
    return res.status(403).json({
      status: "error",
      result: "error",
      message: "Lisensi sudah expired",
      code: 403,
      expired
    })
  }

  const token = crypto.createHash("md5").update(`${username}:${password}:${Date.now()}`).digest("hex")

  res.json({
    status: "success",
    result: "success",
    message: "Login berhasil",
    code: 200,
    data: { username, token, expired, hwid }
  })
}
