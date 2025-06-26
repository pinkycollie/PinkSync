import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { formData, formType } = await request.json()

    // Validate request
    if (!formData || !formType) {
      return NextResponse.json({ error: "Missing required fields: formData and formType" }, { status: 400 })
    }

    // Process the form using AI
    const { text: processedForm } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Process the following ${formType} form data and extract all relevant information.
        Format the output as a structured JSON object with appropriate fields.
        Form data: ${JSON.stringify(formData)}
      `,
      system: "You are an AI assistant specialized in processing forms and extracting structured data from them.",
    })

    // Parse the AI response
    let parsedResult
    try {
      parsedResult = JSON.parse(processedForm)
    } catch (e) {
      // If parsing fails, return the raw text
      parsedResult = { rawResult: processedForm }
    }

    // Return the processed form data
    return NextResponse.json({
      success: true,
      processedForm: parsedResult,
      message: "Form processed successfully",
    })
  } catch (error) {
    console.error("Error processing form:", error)
    return NextResponse.json({ error: "Failed to process form" }, { status: 500 })
  }
}
