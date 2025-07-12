// Visual feedback system for accessibility
export interface VisualFeedback {
  icon?: string
  color?: "red" | "green" | "blue" | "orange" | "purple"
  animation?: "pulse" | "shake" | "bounce" | "none"
  vibration?: boolean
  message?: string
}

export const visualFeedback = {
  success: (options: Partial<VisualFeedback> = {}): VisualFeedback => ({
    icon: "check-circle",
    color: "green",
    animation: "none",
    vibration: false,
    ...options,
  }),
  error: (options: Partial<VisualFeedback> = {}): VisualFeedback => ({
    icon: "alert-circle",
    color: "red",
    animation: "shake",
    vibration: true,
    ...options,
  }),
  warning: (options: Partial<VisualFeedback> = {}): VisualFeedback => ({
    icon: "alert-triangle",
    color: "orange",
    animation: "pulse",
    vibration: false,
    ...options,
  }),
}

export function createApiResponse(
  status: "success" | "error" | "warning",
  data?: any,
  feedback?: VisualFeedback,
  errorCode?: string,
  message?: string,
) {
  return {
    status,
    data,
    feedback,
    errorCode,
    message,
    timestamp: new Date().toISOString(),
    service: "vcode.pinksync.io",
  }
}
