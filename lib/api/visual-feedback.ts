import type { VisualFeedback, ApiResponse } from "@/lib/db/schema"

export class VisualFeedbackManager {
  static createFeedback(
    type: VisualFeedback["type"],
    message: string,
    options?: Partial<VisualFeedback>,
  ): VisualFeedback {
    const feedbackConfig = {
      success: {
        icon: "check-circle",
        color: "#10B981",
        animation: "bounce",
        vibration: true,
        duration: 3000,
      },
      error: {
        icon: "x-circle",
        color: "#EF4444",
        animation: "shake",
        vibration: true,
        duration: 5000,
      },
      warning: {
        icon: "alert-triangle",
        color: "#F59E0B",
        animation: "pulse",
        vibration: false,
        duration: 4000,
      },
      info: {
        icon: "info",
        color: "#3B82F6",
        animation: "fade",
        vibration: false,
        duration: 3000,
      },
      processing: {
        icon: "loader",
        color: "#6366F1",
        animation: "spin",
        vibration: false,
        duration: 0, // Indefinite
      },
    }

    const config = feedbackConfig[type]

    return {
      type,
      message,
      icon: options?.icon || config.icon,
      color: options?.color || config.color,
      animation: options?.animation || config.animation,
      vibration: options?.vibration ?? config.vibration,
      duration: options?.duration ?? config.duration,
    }
  }

  static createApiResponse<T>(
    success: boolean,
    data?: T,
    error?: string,
    errorCode?: string,
    visualFeedback?: VisualFeedback,
  ): ApiResponse<T> {
    const requestId = crypto.randomUUID()

    // Auto-generate visual feedback if not provided
    if (!visualFeedback) {
      if (success) {
        visualFeedback = this.createFeedback("success", "Operation completed successfully")
      } else {
        visualFeedback = this.createFeedback("error", error || "An error occurred")
      }
    }

    return {
      success,
      data,
      error,
      error_code: errorCode,
      visual_feedback: visualFeedback,
      timestamp: new Date().toISOString(),
      request_id: requestId,
    }
  }
}
