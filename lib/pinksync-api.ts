import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface SignLanguageContent {
  id: string
  title: string
  description: string
  category: string
  qr_code_data: string
  video_url?: string
  model_3d_url?: string
  ar_preview_url?: string
  languages: string[]
  created_at: string
  updated_at: string
  is_active: boolean
  metadata: Record<string, any>
}

export interface QRScanEvent {
  content_id: string
  qr_code_data: string
  user_agent?: string
  ip_address?: string
  location_data?: Record<string, any>
  session_id?: string
}

export interface ProcessingJob {
  id: string
  content_id: string
  job_type: "generate_video" | "generate_3d" | "process_ar"
  status: "pending" | "processing" | "completed" | "failed"
  input_data: Record<string, any>
  output_data?: Record<string, any>
  error_message?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export class PinkSyncAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_PINKSYNC_API_URL || "http://localhost:3000"
  }

  // Sign Language Content Management
  async getSignLanguageContent(qrCodeData: string): Promise<SignLanguageContent | null> {
    try {
      const result = await sql`
        SELECT * FROM sign_language_content 
        WHERE qr_code_data = ${qrCodeData} AND is_active = true
        LIMIT 1
      `
      return (result[0] as SignLanguageContent) || null
    } catch (error) {
      console.error("Error fetching sign language content:", error)
      return null
    }
  }

  async getAllSignLanguageContent(category?: string): Promise<SignLanguageContent[]> {
    try {
      const result = category
        ? await sql`
            SELECT * FROM sign_language_content 
            WHERE category = ${category} AND is_active = true
            ORDER BY created_at DESC
          `
        : await sql`
            SELECT * FROM sign_language_content 
            WHERE is_active = true
            ORDER BY created_at DESC
          `
      return result as SignLanguageContent[]
    } catch (error) {
      console.error("Error fetching all sign language content:", error)
      return []
    }
  }

  async createSignLanguageContent(
    content: Omit<SignLanguageContent, "id" | "created_at" | "updated_at">,
  ): Promise<SignLanguageContent | null> {
    try {
      const result = await sql`
        INSERT INTO sign_language_content (
          title, description, category, qr_code_data, 
          video_url, model_3d_url, ar_preview_url, languages, metadata
        ) VALUES (
          ${content.title}, ${content.description}, ${content.category}, ${content.qr_code_data},
          ${content.video_url || null}, ${content.model_3d_url || null}, ${content.ar_preview_url || null},
          ${content.languages}, ${JSON.stringify(content.metadata)}
        )
        RETURNING *
      `
      return result[0] as SignLanguageContent
    } catch (error) {
      console.error("Error creating sign language content:", error)
      return null
    }
  }

  // QR Code Scanning Analytics
  async trackQRScan(scanEvent: QRScanEvent): Promise<boolean> {
    try {
      await sql`
        INSERT INTO qr_code_scans (
          content_id, qr_code_data, user_agent, ip_address, location_data, session_id
        ) VALUES (
          ${scanEvent.content_id}, ${scanEvent.qr_code_data}, 
          ${scanEvent.user_agent || null}, ${scanEvent.ip_address || null},
          ${JSON.stringify(scanEvent.location_data || {})}, ${scanEvent.session_id || null}
        )
      `
      return true
    } catch (error) {
      console.error("Error tracking QR scan:", error)
      return false
    }
  }

  async getQRScanAnalytics(contentId: string): Promise<{ total_scans: number; recent_scans: any[] }> {
    try {
      const totalResult = await sql`
        SELECT COUNT(*) as total_scans FROM qr_code_scans WHERE content_id = ${contentId}
      `

      const recentResult = await sql`
        SELECT * FROM qr_code_scans 
        WHERE content_id = ${contentId}
        ORDER BY scanned_at DESC
        LIMIT 10
      `

      return {
        total_scans: Number.parseInt(totalResult[0].total_scans),
        recent_scans: recentResult,
      }
    } catch (error) {
      console.error("Error fetching QR scan analytics:", error)
      return { total_scans: 0, recent_scans: [] }
    }
  }

  // AI Processing Jobs
  async createProcessingJob(
    job: Omit<ProcessingJob, "id" | "created_at" | "updated_at" | "status">,
  ): Promise<ProcessingJob | null> {
    try {
      const result = await sql`
        INSERT INTO sign_processing_jobs (content_id, job_type, input_data)
        VALUES (${job.content_id}, ${job.job_type}, ${JSON.stringify(job.input_data)})
        RETURNING *
      `
      return result[0] as ProcessingJob
    } catch (error) {
      console.error("Error creating processing job:", error)
      return null
    }
  }

  async updateProcessingJob(jobId: string, updates: Partial<ProcessingJob>): Promise<boolean> {
    try {
      const setClause = []
      const values = []

      if (updates.status) {
        setClause.push("status = $" + (values.length + 1))
        values.push(updates.status)
      }

      if (updates.output_data) {
        setClause.push("output_data = $" + (values.length + 1))
        values.push(JSON.stringify(updates.output_data))
      }

      if (updates.error_message) {
        setClause.push("error_message = $" + (values.length + 1))
        values.push(updates.error_message)
      }

      if (updates.completed_at) {
        setClause.push("completed_at = $" + (values.length + 1))
        values.push(updates.completed_at)
      }

      setClause.push("updated_at = NOW()")
      values.push(jobId)

      await sql`
        UPDATE sign_processing_jobs 
        SET ${sql.unsafe(setClause.join(", "))}
        WHERE id = $${values.length}
      `

      return true
    } catch (error) {
      console.error("Error updating processing job:", error)
      return false
    }
  }

  // Real-time sync functionality
  async syncContentUpdates(): Promise<SignLanguageContent[]> {
    try {
      const result = await sql`
        SELECT * FROM sign_language_content 
        WHERE updated_at > NOW() - INTERVAL '1 hour'
        AND is_active = true
        ORDER BY updated_at DESC
      `
      return result as SignLanguageContent[]
    } catch (error) {
      console.error("Error syncing content updates:", error)
      return []
    }
  }
}

export const pinkSyncAPI = new PinkSyncAPI()
