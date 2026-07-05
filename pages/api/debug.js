export default async function handler(req, res) {
  const info = {
    has_kv_package: false,
    kv_env_vars: {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    },
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV || "unknown",
  }

  try {
    const mod = await import("@vercel/kv")
    info.has_kv_package = true
    info.kv_type = typeof mod.kv
    try {
      const test = await mod.kv.hgetall("users")
      info.kv_test = { success: true, data: test }
    } catch (e) {
      info.kv_test = { success: false, error: e.message }
    }
  } catch (e) {
    info.has_kv_package = false
    info.import_error = e.message
  }

  res.setHeader("Content-Type", "application/json")
  res.status(200).json(info)
}
