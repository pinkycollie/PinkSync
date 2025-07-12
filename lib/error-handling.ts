import { NextResponse } from "next/server"
import { createApiResponse, visualFeedback } from "./visual-feedback"

export function createErrorResponse(errorCode: string, details?: any) {
  const errorMap = {
    validation_error: {
      status: 400,
      message: "Request validation failed",
      feedback: visualFeedback.error({ icon: "alert-triangle", color: "orange" }),
    },
    unauthorized: {
      status: 401,
      message: "Authentication required",
      feedback: visualFeedback.error({ icon: "lock" }),
    },
    forbidden: {
      status: 403,
      message: "Access denied",
      feedback: visualFeedback.error({ icon: "shield" }),
    },
    vcode_not_found: {
      status: 404,
      message: "vCode not found",
      feedback: visualFeedback.error({ icon: "search" }),
    },
    server_error: {
      status: 500,
      message: "Internal server error",
      feedback: visualFeedback.error({ icon: "server-crash" }),
    },
  }

  const error = errorMap[errorCode as keyof typeof errorMap] || errorMap.server_error

  return NextResponse.json(createApiResponse("error", details, error.feedback, errorCode, error.message), {
    status: error.status,
  })
}
