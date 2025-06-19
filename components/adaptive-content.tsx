"use client"

import { useState, useEffect } from "react"
import { usePreferences } from "@/components/preferences-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logUserInteraction } from "@/app/actions/user-actions"
import { useSession } from "next-auth/react"
import SignLanguageExplanation from "@/components/sign-language-explanation"

interface AdaptiveContentProps {
  contentId: string
  title: string
  textContent: string
  signLanguageText?: string
}

export function AdaptiveContent({ contentId, title, textContent, signLanguageText }: AdaptiveContentProps) {
  const { preferences, isLoading } = usePreferences()
  const { data: session } = useSession()
  const [showSignLanguage, setShowSignLanguage] = useState(false)
  const [textSize, setTextSize] = useState("text-base")
  const [viewStartTime, setViewStartTime] = useState(Date.now())

  useEffect(() => {
    // Set initial state based on user preferences
    if (!isLoading) {
      setShowSignLanguage(
        preferences.communication_method === "sign_language" || preferences.sign_language_preferences.enabled,
      )

      // Set text size based on preferences
      if (preferences.visual_preferences.large_text) {
        setTextSize("text-lg")
      } else {
        setTextSize("text-base")
      }

      // Record view start time for engagement metrics
      setViewStartTime(Date.now())
    }

    // Log interaction when component unmounts
    return () => {
      if (session?.user?.id) {
        const viewDuration = (Date.now() - viewStartTime) / 1000 // in seconds
        logUserInteraction(
          session.user.id,
          "content_view",
          contentId,
          {
            duration: viewDuration,
            sign_language_shown: showSignLanguage,
          },
          null,
        )
      }
    }
  }, [isLoading, preferences, contentId, session, viewStartTime, showSignLanguage])

  const toggleSignLanguage = () => {
    setShowSignLanguage(!showSignLanguage)

    // Log this interaction
    if (session?.user?.id) {
      logUserInteraction(
        session.user.id,
        showSignLanguage ? "sign_language_hide" : "sign_language_view",
        contentId,
        {
          timestamp: new Date().toISOString(),
        },
        null,
      )
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-muted rounded-md"></div>
  }

  return (
    <Card className={preferences.visual_preferences.high_contrast ? "border-2 border-primary" : ""}>
      <CardContent className="p-6">
        <h3 className={`font-semibold mb-4 ${preferences.visual_preferences.large_text ? "text-2xl" : "text-xl"}`}>
          {title}
        </h3>

        {showSignLanguage && (
          <div className="mb-4">
            <SignLanguageExplanation
              text={signLanguageText || textContent}
              videoUrl={`/placeholder.svg?height=360&width=640&query=sign language explanation for: ${encodeURIComponent(
                title,
              )}`}
            />
          </div>
        )}

        <div className={`${textSize} ${showSignLanguage ? "mt-4" : ""}`}>
          {textContent.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-2">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={toggleSignLanguage}>
            {showSignLanguage ? "Hide Sign Language" : "Show Sign Language"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
