import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

    // Validate request
    if (!message) {
      return NextResponse.json({ error: "Missing required field: message" }, { status: 400 })
    }

    // Process the message using AI
    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: `You are a helpful assistant for VisualDesk, an AI-powered virtual assistant for Deaf users.
        You help with form processing, communication, and providing clear information.
        ${context ? `Current context: ${context}` : ""}
        User ID: ${userId || "anonymous"}
        Be clear, visual-first in your explanations, and avoid jargon.`,
    })

    // Return the AI response
    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
