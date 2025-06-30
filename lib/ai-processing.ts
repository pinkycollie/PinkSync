import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import * as fal from "@fal-ai/serverless-client"

// Configure FAL client
fal.config({
  credentials: process.env.FAL_KEY!,
})

export interface SignLanguageGenerationRequest {
  text: string
  language: "ASL" | "BSL" | "International Sign"
  style: "formal" | "casual" | "emergency"
  duration?: number
}

export interface SignLanguageGenerationResult {
  video_url?: string
  model_3d_url?: string
  ar_preview_url?: string
  metadata: {
    processing_time: number
    language: string
    confidence_score: number
    generated_at: string
  }
}

export class AIProcessingService {
  // Generate sign language description using Groq
  async generateSignLanguageDescription(text: string, language = "ASL"): Promise<string> {
    try {
      const { text: description } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `
          You are an expert in ${language} (${language === "ASL" ? "American Sign Language" : language === "BSL" ? "British Sign Language" : "International Sign Language"}).
          
          Convert the following text into detailed sign language instructions that describe how to sign each word and phrase:
          
          Text: "${text}"
          
          Provide:
          1. A breakdown of key signs needed
          2. Hand positions and movements
          3. Facial expressions and non-manual markers
          4. Spatial relationships and directional signs
          5. Cultural considerations for the Deaf community
          
          Format the response as clear, actionable instructions for someone learning to sign this content.
        `,
        system: `You are a certified sign language interpreter and educator specializing in ${language}. Your responses should be accurate, culturally appropriate, and accessible to both beginners and advanced signers.`,
      })

      return description
    } catch (error) {
      console.error("Error generating sign language description:", error)
      throw new Error("Failed to generate sign language description")
    }
  }

  // Generate sign language video using FAL AI
  async generateSignLanguageVideo(request: SignLanguageGenerationRequest): Promise<string> {
    try {
      const prompt = await this.createVideoPrompt(request)

      const result = await fal.subscribe("fal-ai/stable-video-diffusion", {
        input: {
          image_url: await this.getSignerAvatarImage(request.language),
          motion_bucket_id: 127,
          cond_aug: 0.02,
          steps: 25,
          fps: 6,
          seed: Math.floor(Math.random() * 1000000),
          prompt: prompt,
        },
      })

      return result.video.url
    } catch (error) {
      console.error("Error generating sign language video:", error)
      throw new Error("Failed to generate sign language video")
    }
  }

  // Generate 3D avatar model
  async generate3DAvatar(request: SignLanguageGenerationRequest): Promise<string> {
    try {
      const result = await fal.subscribe("fal-ai/triposr", {
        input: {
          image_url: await this.getSignerAvatarImage(request.language),
          foreground_ratio: 0.85,
          geometry_resolution: 256,
          texture_resolution: 512,
        },
      })

      return result.model_url
    } catch (error) {
      console.error("Error generating 3D avatar:", error)
      throw new Error("Failed to generate 3D avatar")
    }
  }

  // Create AR preview
  async generateARPreview(videoUrl: string, modelUrl: string): Promise<string> {
    try {
      // Combine video and 3D model for AR preview
      const result = await fal.subscribe("fal-ai/stable-video-diffusion", {
        input: {
          image_url: modelUrl,
          motion_bucket_id: 100,
          cond_aug: 0.02,
          steps: 20,
          fps: 12,
          seed: Math.floor(Math.random() * 1000000),
          prompt: "AR hologram effect, transparent background, floating in space, glowing edges",
        },
      })

      return result.video.url
    } catch (error) {
      console.error("Error generating AR preview:", error)
      throw new Error("Failed to generate AR preview")
    }
  }

  // Process complete sign language content
  async processSignLanguageContent(request: SignLanguageGenerationRequest): Promise<SignLanguageGenerationResult> {
    const startTime = Date.now()

    try {
      // Generate description first
      const description = await this.generateSignLanguageDescription(request.text, request.language)

      // Generate video
      const videoUrl = await this.generateSignLanguageVideo(request)

      // Generate 3D model
      const modelUrl = await this.generate3DAvatar(request)

      // Generate AR preview
      const arPreviewUrl = await this.generateARPreview(videoUrl, modelUrl)

      const processingTime = Date.now() - startTime

      return {
        video_url: videoUrl,
        model_3d_url: modelUrl,
        ar_preview_url: arPreviewUrl,
        metadata: {
          processing_time: processingTime,
          language: request.language,
          confidence_score: 0.95, // This would come from actual AI processing
          generated_at: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error("Error processing sign language content:", error)
      throw error
    }
  }

  // Helper methods
  private async createVideoPrompt(request: SignLanguageGenerationRequest): Promise<string> {
    const { text: prompt } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Create a detailed video generation prompt for ${request.language} sign language content.
        
        Text to sign: "${request.text}"
        Style: ${request.style}
        Language: ${request.language}
        
        Generate a prompt that describes:
        - Hand movements and positions
        - Facial expressions
        - Body positioning
        - Signing pace and rhythm
        - Background and lighting
        
        Make it suitable for AI video generation.
      `,
    })

    return prompt
  }

  private async getSignerAvatarImage(language: string): Promise<string> {
    // In a real implementation, this would return different avatar images based on language/culture
    const avatarMap = {
      ASL: "/placeholder.svg?height=512&width=512",
      BSL: "/placeholder.svg?height=512&width=512",
      "International Sign": "/placeholder.svg?height=512&width=512",
    }

    return avatarMap[language as keyof typeof avatarMap] || avatarMap["ASL"]
  }

  // Quality assessment using AI
  async assessSignLanguageQuality(videoUrl: string, originalText: string): Promise<number> {
    try {
      const { text: assessment } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `
          Assess the quality of this sign language video based on the original text.
          
          Original text: "${originalText}"
          Video URL: ${videoUrl}
          
          Rate the quality from 0.0 to 1.0 based on:
          - Accuracy of signs
          - Clarity of movements
          - Appropriate facial expressions
          - Cultural appropriateness
          - Overall comprehensibility
          
          Return only a number between 0.0 and 1.0.
        `,
      })

      const score = Number.parseFloat(assessment.trim())
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score))
    } catch (error) {
      console.error("Error assessing sign language quality:", error)
      return 0.5 // Default score
    }
  }
}

export const aiProcessingService = new AIProcessingService()
