// Vercel Edge Function to proxy requests to GCP services
import { type NextRequest, NextResponse } from "next/server"

export const config = {
  runtime: "edge",
}

const GCP_ENDPOINTS = {
  "sign-language-auth": process.env.SIGN_LANGUAGE_AUTH_URL,
  "accessibility-api": process.env.ACCESSIBILITY_API_URL,
  "visual-notifications": process.env.VISUAL_NOTIFICATIONS_URL,
}

export default async function handler(req: NextRequest) {
  const url = new URL(req.url)
  const service = url.pathname.split("/")[2] // /api/[service]/...
  const path = url.pathname.replace(`/api/${service}`, "")

  const targetUrl = GCP_ENDPOINTS[service as keyof typeof GCP_ENDPOINTS]

  if (!targetUrl) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  try {
    const response = await fetch(`${targetUrl}${path}`, {
      method: req.method,
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: req.method !== "GET" ? await req.text() : undefined,
    })

    const data = await response.text()

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
