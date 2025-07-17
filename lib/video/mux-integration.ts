export interface MuxVideoConfig {
  playbackId: string
  assetId: string
  title: string
  duration: number
  status: "preparing" | "ready" | "errored"
  thumbnailUrl: string
  aspectRatio: string
}

export interface MuxUploadConfig {
  uploadUrl: string
  uploadId: string
  assetId: string
  status: "waiting" | "uploading" | "processing" | "ready" | "errored"
}

export class MuxVideoManager {
  private apiKey: string
  private secretKey: string
  private baseUrl = "https://api.mux.com"

  constructor() {
    this.apiKey = process.env.MUX_TOKEN_ID || ""
    this.secretKey = process.env.MUX_TOKEN_SECRET || ""
  }

  async createDirectUpload(metadata: {
    title: string
    category: string
    signer: string
    transcript: string
  }): Promise<MuxUploadConfig> {
    const response = await fetch(`${this.baseUrl}/video/v1/uploads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        new_asset_settings: {
          playback_policy: ["public"],
          mp4_support: "standard",
          normalize_audio: true,
          master_access: "temporary",
          test: process.env.NODE_ENV !== "production",
          passthrough: JSON.stringify(metadata),
        },
        cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      }),
    })

    const data = await response.json()

    return {
      uploadUrl: data.data.url,
      uploadId: data.data.id,
      assetId: data.data.new_asset_settings?.asset_id || "",
      status: "waiting",
    }
  }

  async getAssetInfo(assetId: string): Promise<MuxVideoConfig | null> {
    try {
      const response = await fetch(`${this.baseUrl}/video/v1/assets/${assetId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64")}`,
        },
      })

      const data = await response.json()
      const asset = data.data

      return {
        playbackId: asset.playback_ids?.[0]?.id || "",
        assetId: asset.id,
        title: asset.passthrough ? JSON.parse(asset.passthrough).title : "Untitled",
        duration: asset.duration || 0,
        status: asset.status === "ready" ? "ready" : asset.status === "errored" ? "errored" : "preparing",
        thumbnailUrl: asset.playback_ids?.[0]?.id
          ? `https://image.mux.com/${asset.playback_ids[0].id}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop`
          : "",
        aspectRatio: asset.aspect_ratio || "16:9",
      }
    } catch (error) {
      console.error("Error fetching Mux asset:", error)
      return null
    }
  }

  async getVideoAnalytics(playbackId: string, timeframe: "24:hours" | "7:days" | "30:days" = "7:days") {
    try {
      const response = await fetch(
        `${this.baseUrl}/data/v1/metrics/video_views?group_by=assetId&timeframe=${timeframe}&filters[]=playback_id:${playbackId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64")}`,
          },
        },
      )

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Error fetching Mux analytics:", error)
      return []
    }
  }

  generatePlayerUrl(
    playbackId: string,
    options?: {
      autoplay?: boolean
      muted?: boolean
      loop?: boolean
      controls?: boolean
      startTime?: number
    },
  ): string {
    const params = new URLSearchParams()

    if (options?.autoplay) params.set("autoplay", "1")
    if (options?.muted) params.set("muted", "1")
    if (options?.loop) params.set("loop", "1")
    if (options?.controls === false) params.set("controls", "0")
    if (options?.startTime) params.set("time", options.startTime.toString())

    const queryString = params.toString()
    return `https://stream.mux.com/${playbackId}.m3u8${queryString ? `?${queryString}` : ""}`
  }

  generateThumbnailUrl(
    playbackId: string,
    options?: {
      width?: number
      height?: number
      time?: number
      fitMode?: "preserve" | "stretch" | "crop" | "smartcrop"
    },
  ): string {
    const params = new URLSearchParams()

    if (options?.width) params.set("width", options.width.toString())
    if (options?.height) params.set("height", options.height.toString())
    if (options?.time) params.set("time", options.time.toString())
    if (options?.fitMode) params.set("fit_mode", options.fitMode)

    const queryString = params.toString()
    return `https://image.mux.com/${playbackId}/thumbnail.jpg${queryString ? `?${queryString}` : ""}`
  }
}

export const muxVideoManager = new MuxVideoManager()
