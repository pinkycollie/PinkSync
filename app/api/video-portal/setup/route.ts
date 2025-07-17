import { type NextRequest, NextResponse } from "next/server"

// API endpoint to verify domain setup
export async function GET(request: NextRequest) {
  try {
    // Check DNS resolution
    const dnsCheck = await fetch(`https://dns.google/resolve?name=deaflife.pinksync.io&type=A`)
    const dnsResult = await dnsCheck.json()

    // Check SSL certificate
    const sslCheck = await fetch("https://deaflife.pinksync.io", {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    // Check CDN status
    const cdnHeaders = sslCheck?.headers

    return NextResponse.json({
      status: "success",
      checks: {
        dns: {
          resolved: dnsResult.Answer?.length > 0,
          records: dnsResult.Answer || [],
        },
        ssl: {
          active: sslCheck?.ok || false,
          status: sslCheck?.status || "unreachable",
        },
        cdn: {
          active: cdnHeaders?.get("cf-ray") || cdnHeaders?.get("x-vercel-cache") ? true : false,
          provider: cdnHeaders?.get("cf-ray") ? "cloudflare" : cdnHeaders?.get("x-vercel-cache") ? "vercel" : "unknown",
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
