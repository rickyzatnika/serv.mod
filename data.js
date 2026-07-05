let kv = null
let kvInitialized = false

async function getKv() {
  if (kvInitialized) return kv
  kvInitialized = true
  try {
    const mod = await import("@vercel/kv")
    kv = mod.kv
    console.log("KV connected")
  } catch {
    console.log("KV not available, using in-memory")
  }
  return kv
}

const memoryStore = {}
const memoryLogs = []
const MAX_LOGS = 100

export async function getUser(username) {
  const db = await getKv()
  if (db) {
    try {
      const raw = await db.hget("users", username)
      return raw ? JSON.parse(raw) : null
    } catch (e) { console.error("KV getUser error:", e) }
  }
  return memoryStore[username] || null
}

export async function setUser(username, data) {
  const db = await getKv()
  if (db) {
    try {
      await db.hset("users", { [username]: JSON.stringify(data) })
      return
    } catch (e) { console.error("KV setUser error:", e) }
  }
  memoryStore[username] = data
}

export async function deleteUser(username) {
  const db = await getKv()
  if (db) {
    try {
      await db.hdel("users", username)
      return
    } catch (e) { console.error("KV deleteUser error:", e) }
  }
  delete memoryStore[username]
}

export async function getAllUsers() {
  const db = await getKv()
  if (db) {
    try {
      const raw = await db.hgetall("users")
      if (!raw) return {}
      const result = {}
      for (const [key, val] of Object.entries(raw)) result[key] = JSON.parse(val)
      return result
    } catch (e) { console.error("KV getAllUsers error:", e) }
  }
  return { ...memoryStore }
}

export async function logRequest(endpoint, username = "", hwid = "", ip = "") {
  const entry = {
    time: new Date().toISOString().slice(0, 19).replace("T", " "),
    endpoint, username, hwid, ip
  }
  const db = await getKv()
  if (db) {
    try {
      await db.lpush("logs", JSON.stringify(entry))
      await db.ltrim("logs", 0, MAX_LOGS - 1)
      return
    } catch (e) { console.error("KV logRequest error:", e) }
  }
  memoryLogs.unshift(entry)
  if (memoryLogs.length > MAX_LOGS) memoryLogs.length = MAX_LOGS
}

export async function getLogs() {
  const db = await getKv()
  if (db) {
    try {
      const raw = await db.lrange("logs", 0, MAX_LOGS - 1)
      return (raw || []).map(r => JSON.parse(r))
    } catch (e) { console.error("KV getLogs error:", e) }
  }
  return [...memoryLogs]
}
