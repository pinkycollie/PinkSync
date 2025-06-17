import { type NextRequest, NextResponse } from "next/server"

interface EnvironmentConfig {
  environment: string
  services: {
    database: {
      url: string
      status: "connected" | "disconnected"
    }
    blob_storage: {
      status: "configured" | "not_configured"
      region: string
    }
    ai_services: {
      vertex_ai: boolean
      fal_ai: boolean
      groq: boolean
      xai: boolean
    }
    integrations: {
      google_workspace: boolean
      supabase: boolean
      vercel: boolean
    }
  }
  automation: {
    workflows_enabled: boolean
    webhooks_configured: boolean
    real_time_updates: boolean
  }
}

export async function GET(request: NextRequest) {
  try {
    const config: EnvironmentConfig = {
      environment: process.env.NODE_ENV || "development",
      services: {
        database: {
          url: process.env.SUPABASE_URL ? "configured" : "not_configured",
          status: process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? "connected" : "disconnected",
        },
        blob_storage: {
          status: process.env.BLOB_READ_WRITE_TOKEN ? "configured" : "not_configured",
          region: "auto",
        },
        ai_services: {
          vertex_ai: !!process.env.GOOGLE_CLOUD_ACCESS_TOKEN,
          fal_ai: !!process.env.FAL_KEY,
          groq: !!process.env.GROQ_API_KEY,
          xai: !!process.env.XAI_API_KEY,
        },
        integrations: {
          google_workspace: !!(
            process.env.GOOGLE_CLIENT_ID &&
            process.env.GOOGLE_CLIENT_SECRET &&
            process.env.GOOGLE_REDIRECT_URI
          ),
          supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
          vercel: !!process.env.VERCEL,
        },
      },
      automation: {
        workflows_enabled: !!process.env.WEBHOOK_SECRET,
        webhooks_configured: !!(process.env.WEBHOOK_SECRET && process.env.NEXT_PUBLIC_APP_URL),
        real_time_updates: true, // Always enabled in this setup
      },
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Environment config error:", error)
    return NextResponse.json({ error: "Failed to get environment config" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, service, config } = await request.json()

    switch (action) {
      case "test_connection":
        const result = await testServiceConnection(service)
        return NextResponse.json({ service, status: result })

      case "restart_service":
        await restartService(service)
        return NextResponse.json({ service, status: "restarted" })

      case "update_config":
        await updateServiceConfig(service, config)
        return NextResponse.json({ service, status: "updated" })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Environment config action error:", error)
    return NextResponse.json({ error: "Action failed" }, { status: 500 })
  }
}

async function testServiceConnection(service: string): Promise<"connected" | "failed"> {
  try {
    switch (service) {
      case "database":
        const dbResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles?select=count`, {
          headers: {
            apikey: process.env.SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
        })
        return dbResponse.ok ? "connected" : "failed"

      case "fal_ai":
        const falResponse = await fetch("https://fal.run/fal-ai/fast-sdxl", {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: "test" }),
        })
        return falResponse.status !== 401 ? "connected" : "failed"

      case "vertex_ai":
        return process.env.GOOGLE_CLOUD_ACCESS_TOKEN ? "connected" : "failed"

      default:
        return "failed"
    }
  } catch {
    return "failed"
  }
}

async function restartService(service: string) {
  // Implement service restart logic
  console.log(`Restarting service: ${service}`)
}

async function updateServiceConfig(service: string, config: any) {
  // Implement service config update logic
  console.log(`Updating config for service: ${service}`, config)
}
