import { kv } from "@vercel/kv"

// Export the configured KV instance
export { kv }

// Helper function to check if KV is properly configured
export async function checkKVConnection(): Promise<boolean> {
  try {
    // Try to set and get a test value
    await kv.set("test:connection", "ok", { ex: 10 })
    const result = await kv.get("test:connection")
    return result === "ok"
  } catch (error) {
    console.error("KV connection error:", error)
    return false
  }
}
