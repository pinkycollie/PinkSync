import { type NextRequest, NextResponse } from "next/server"
import { ModularIdentitySystem } from "@/lib/security/modular-identity-system"
import { BreachDetectionSystem } from "@/lib/security/breach-detection-system"

const modularIdentitySystem = new ModularIdentitySystem()
const breachDetectionSystem = new BreachDetectionSystem(modularIdentitySystem)

export async function POST(request: NextRequest) {
  try {
    const { action, moduleId, moduleType, connectionData } = await request.json()

    switch (action) {
      case "create_module":
        const newModuleId = await modularIdentitySystem.createModularIdentity(
          connectionData.userId,
          moduleType,
          connectionData.moduleName,
          connectionData,
        )
        return NextResponse.json({ success: true, moduleId: newModuleId })

      case "connect_government":
        const govModuleId = await modularIdentitySystem.connectGovernmentModule(
          connectionData.userId,
          connectionData.agency,
          connectionData.credentials,
        )
        return NextResponse.json({ success: true, moduleId: govModuleId })

      case "connect_healthcare":
        const healthModuleId = await modularIdentitySystem.connectHealthcareModule(
          connectionData.userId,
          connectionData.provider,
          connectionData.credentials,
        )
        return NextResponse.json({ success: true, moduleId: healthModuleId })

      case "connect_financial":
        const finModuleId = await modularIdentitySystem.connectFinancialModule(
          connectionData.userId,
          connectionData.institution,
          connectionData.credentials,
        )
        return NextResponse.json({ success: true, moduleId: finModuleId })

      case "connect_family":
        const familyModuleId = await modularIdentitySystem.connectFamilyModule(
          connectionData.userId,
          connectionData.familyMemberId,
          connectionData.relationship,
          connectionData.permissions,
        )
        return NextResponse.json({ success: true, moduleId: familyModuleId })

      case "authenticate_module":
        const authResult = await modularIdentitySystem.authenticateModule(moduleId, connectionData.authData)
        return NextResponse.json(authResult)

      case "isolate_module":
        await modularIdentitySystem.isolateModule(moduleId)
        return NextResponse.json({ success: true, message: "Module isolated successfully" })

      case "detect_breach":
        const breachResponses = await breachDetectionSystem.detectBreach(connectionData.indicators)
        return NextResponse.json({ success: true, responses: breachResponses })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Module isolation error:", error)
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const moduleType = searchParams.get("moduleType")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get user's modules with isolation status
    const modules = await getUserModules(userId, moduleType)

    return NextResponse.json({ success: true, modules })
  } catch (error) {
    console.error("Get modules error:", error)
    return NextResponse.json({ error: "Failed to retrieve modules" }, { status: 500 })
  }
}

async function getUserModules(userId: string, moduleType?: string): Promise<any[]> {
  const { db } = await import("@/lib/database")

  let query = `
    SELECT 
      module_id,
      module_name,
      module_type,
      status,
      isolated_at,
      audit_trail,
      created_at
    FROM modular_identities 
    WHERE user_id = $1
  `

  const params = [userId]

  if (moduleType) {
    query += ` AND module_type = $2`
    params.push(moduleType)
  }

  query += ` ORDER BY created_at DESC`

  const result = await db.query(query, params)
  return result.rows
}
