import express from "express"
import { SpeechClient } from "@google-cloud/speech"
import { PubSub } from "@google-cloud/pubsub"
import { Firestore } from "@google-cloud/firestore"

const app = express()
const speechClient = new SpeechClient()
const pubsub = new PubSub()
const firestore = new Firestore()

app.use(express.json())

// Real-time captioning endpoint
app.post("/accessibility/captions", async (req, res) => {
  try {
    const { audioData, userId } = req.body

    if (!audioData) {
      return res.status(400).json({ error: "Audio data required" })
    }

    // Get user preferences for captioning
    const userDoc = await firestore.collection("users").doc(userId).get()
    const preferences = userDoc.data()?.accessibilityPreferences || {}

    const request = {
      audio: {
        content: audioData,
      },
      config: {
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 16000,
        languageCode: preferences.language || "en-US",
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
      },
    }

    const [response] = await speechClient.recognize(request)
    const transcription = response.results?.map((result) => result.alternatives?.[0]).filter(Boolean)

    const captions =
      transcription?.map((alt, index) => ({
        text: alt?.transcript || "",
        confidence: alt?.confidence || 0,
        words:
          alt?.words?.map((word) => ({
            word: word.word,
            startTime: word.startTime,
            endTime: word.endTime,
          })) || [],
      })) || []

    // Store captions for user history
    await firestore.collection("captions").add({
      userId,
      captions,
      timestamp: new Date(),
      sessionId: req.headers["session-id"] || "unknown",
    })

    res.json({ captions })
  } catch (error) {
    console.error("Captioning error:", error)
    res.status(500).json({ error: "Captioning service error" })
  }
})

// Visual notification preferences
app.post("/accessibility/preferences", async (req, res) => {
  try {
    const { userId, preferences } = req.body

    await firestore
      .collection("users")
      .doc(userId)
      .set(
        {
          accessibilityPreferences: {
            visualNotifications: preferences.visualNotifications || true,
            captionStyle: preferences.captionStyle || "standard",
            language: preferences.language || "en-US",
            vibrationEnabled: preferences.vibrationEnabled || true,
            flashEnabled: preferences.flashEnabled || true,
            fontSize: preferences.fontSize || "medium",
          },
        },
        { merge: true },
      )

    res.json({ success: true })
  } catch (error) {
    console.error("Preferences error:", error)
    res.status(500).json({ error: "Failed to update preferences" })
  }
})

// Trigger visual notification
app.post("/notifications/visual", async (req, res) => {
  try {
    const { userId, message, type = "visual_alert" } = req.body

    // Publish to Pub/Sub for Cloud Function processing
    const topic = pubsub.topic("visual-notifications")
    await topic.publishMessage({
      json: {
        userId,
        message,
        type,
        timestamp: new Date().toISOString(),
      },
    })

    res.json({ success: true, message: "Notification queued" })
  } catch (error) {
    console.error("Notification error:", error)
    res.status(500).json({ error: "Failed to send notification" })
  }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Accessibility API listening on port ${port}`)
})
