import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, location, medicalInfo } = await request.json()

    // Connect to 911 dispatch system
    const dispatchResponse = await fetch(process.env.EMERGENCY_911_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMERGENCY_911_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callType: type,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        callerInfo: {
          isDeaf: true,
          communicationMethod: type,
          medicalInfo,
        },
        timestamp: new Date().toISOString(),
      }),
    })

    const dispatchData = await dispatchResponse.json()

    // If video call requested, connect to ASL interpreter service
    let interpreterInfo = null
    if (type === "video") {
      const interpreterResponse = await fetch(process.env.ASL_INTERPRETER_API_URL!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ASL_INTERPRETER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergency: true,
          location: location.address,
          estimatedDuration: 30,
        }),
      })

      interpreterInfo = await interpreterResponse.json()
    }

    return NextResponse.json({
      success: true,
      callId: dispatchData.callId,
      dispatcherId: dispatchData.dispatcherId,
      interpreterInfo,
      estimatedResponseTime: dispatchData.estimatedResponseTime,
    })
  } catch (error) {
    console.error("911 call failed:", error)
    return NextResponse.json({ error: "Emergency call failed" }, { status: 500 })
  }
}
