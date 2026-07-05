import { kv } from "@vercel/kv"

const MAX_LOGS = 100

export async function getUser(username) {
  const raw = await kv.hget("users", username)
  return raw ? JSON.parse(raw) : null
}

export async function setUser(username, data) {
  await kv.hset("users", { [username]: JSON.stringify(data) })
}

export async function deleteUser(username) {
  await kv.hdel("users", username)
}

export async function getAllUsers() {
  const raw = await kv.hgetall("users")
  if (!raw) return {}
  const result = {}
  for (const [key, val] of Object.entries(raw)) {
    result[key] = JSON.parse(val)
  }
  return result
}

export async function logRequest(endpoint, username = "", hwid = "", ip = "") {
  const entry = {
    time: new Date().toISOString().slice(0, 19).replace("T", " "),
    endpoint,
    username,
    hwid,
    ip
  }
  await kv.lpush("logs", JSON.stringify(entry))
  await kv.ltrim("logs", 0, MAX_LOGS - 1)
}

export async function getLogs() {
  const raw = await kv.lrange("logs", 0, MAX_LOGS - 1)
  return (raw || []).map(r => JSON.parse(r))
}
