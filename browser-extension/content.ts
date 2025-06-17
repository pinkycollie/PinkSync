/**
 * VCode Browser Extension Content Script
 * Integrates with meeting platforms to provide deaf-first assistance
 */

interface VCodeConfig {
  apiEndpoint: string
  groqEnabled: boolean
  accessibilityMode: boolean
  aslRequired: boolean
  meetingType: "medical" | "legal" | "technical" | "general"
}

class VCodeMeetingAssistant {
  private config: VCodeConfig
  private overlay: HTMLElement | null = null
  private isActive = false
  private transcriptBuffer = ""
  private groqProcessor: any = null
  private chrome: any

  constructor(chrome: any) {
    this.chrome = chrome
    this.config = {
      apiEndpoint: "https://vcode.pinksync.io/api",
      groqEnabled: true,
      accessibilityMode: true,
      aslRequired: true,
      meetingType: "general",
    }

    this.init()
  }

  private async init() {
    // Load configuration from storage
    const stored = await this.chrome.storage.sync.get(["vcode_config"])
    if (stored.vcode_config) {
      this.config = { ...this.config, ...stored.vcode_config }
    }

    // Detect meeting platform and inject VCode interface
    this.detectMeetingPlatform()
    this.createVCodeOverlay()
    this.setupEventListeners()
  }

  private detectMeetingPlatform(): string {
    const hostname = window.location.hostname

    if (hostname.includes("meet.google.com")) return "google-meet"
    if (hostname.includes("zoom.us")) return "zoom"
    if (hostname.includes("teams.microsoft.com")) return "teams"
    if (hostname.includes("webex.com")) return "webex"

    return "unknown"
  }

  private createVCodeOverlay() {
    // Create floating VCode assistant overlay
    this.overlay = document.createElement("div")
    this.overlay.id = "vcode-assistant-overlay"
    this.overlay.innerHTML = `
      <div class="vcode-container">
        <div class="vcode-header">
          <div class="vcode-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
            VCode Assistant
          </div>
          <button id="vcode-toggle" class="vcode-toggle">
            <span class="vcode-status-indicator"></span>
          </button>
        </div>
        
        <div id="vcode-panel" class="vcode-panel" style="display: none;">
          <!-- Meeting Type Selector -->
          <div class="vcode-section">
            <label class="vcode-label">Meeting Type</label>
            <select id="meeting-type" class="vcode-select">
              <option value="general">General Meeting</option>
              <option value="medical">Medical Consultation</option>
              <option value="legal">Legal Meeting</option>
              <option value="technical">Technical Discussion</option>
            </select>
          </div>
          
          <!-- Accessibility Settings -->
          <div class="vcode-section">
            <div class="vcode-checkbox-group">
              <label class="vcode-checkbox">
                <input type="checkbox" id="accessibility-mode" checked>
                <span>Accessibility Mode</span>
              </label>
              <label class="vcode-checkbox">
                <input type="checkbox" id="asl-required" checked>
                <span>ASL Interpretation</span>
              </label>
            </div>
          </div>
          
          <!-- Live Transcript -->
          <div class="vcode-section">
            <label class="vcode-label">Live Transcript</label>
            <div id="live-transcript" class="vcode-transcript">
              Waiting for meeting audio...
            </div>
          </div>
          
          <!-- AI Assistance -->
          <div class="vcode-section">
            <label class="vcode-label">AI Assistant</label>
            <div id="ai-response" class="vcode-ai-response">
              Groq AI ready for assistance
            </div>
            <input type="text" id="ai-query" class="vcode-input" placeholder="Ask AI assistant...">
            <button id="ask-ai" class="vcode-button">Ask AI</button>
          </div>
          
          <!-- Quick Actions -->
          <div class="vcode-section">
            <div class="vcode-actions">
              <button id="start-recording" class="vcode-button vcode-primary">Start VCode</button>
              <button id="generate-evidence" class="vcode-button vcode-secondary">Generate Evidence</button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add CSS styles
    const style = document.createElement("style")
    style.textContent = `
      #vcode-assistant-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        border: 2px solid #e5e7eb;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
      }
      
      .vcode-container {
        padding: 16px;
      }
      
      .vcode-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .vcode-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #6366f1;
      }
      
      .vcode-toggle {
        background: #f3f4f6;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .vcode-status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        animation: pulse 2s infinite;
      }
      
      .vcode-panel {
        border-top: 1px solid #e5e7eb;
        padding-top: 12px;
      }
      
      .vcode-section {
        margin-bottom: 16px;
      }
      
      .vcode-label {
        display: block;
        font-weight: 500;
        margin-bottom: 6px;
        color: #374151;
      }
      
      .vcode-select, .vcode-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
      }
      
      .vcode-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .vcode-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      
      .vcode-transcript, .vcode-ai-response {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 12px;
        min-height: 60px;
        max-height: 120px;
        overflow-y: auto;
        font-size: 13px;
        line-height: 1.4;
      }
      
      .vcode-button {
        padding: 8px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }
      
      .vcode-button:hover {
        background: #f9fafb;
      }
      
      .vcode-primary {
        background: #6366f1;
        color: white;
        border-color: #6366f1;
      }
      
      .vcode-primary:hover {
        background: #5856eb;
      }
      
      .vcode-secondary {
        background: #10b981;
        color: white;
        border-color: #10b981;
      }
      
      .vcode-secondary:hover {
        background: #059669;
      }
      
      .vcode-actions {
        display: flex;
        gap: 8px;
      }
      
      .vcode-actions button {
        flex: 1;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `

    document.head.appendChild(style)
    document.body.appendChild(this.overlay)
  }

  private setupEventListeners() {
    if (!this.overlay) return

    // Toggle panel visibility
    const toggle = this.overlay.querySelector("#vcode-toggle") as HTMLButtonElement
    const panel = this.overlay.querySelector("#vcode-panel") as HTMLElement

    toggle?.addEventListener("click", () => {
      const isVisible = panel.style.display !== "none"
      panel.style.display = isVisible ? "none" : "block"
    })

    // Meeting type change
    const meetingType = this.overlay.querySelector("#meeting-type") as HTMLSelectElement
    meetingType?.addEventListener("change", (e) => {
      this.config.meetingType = (e.target as HTMLSelectElement).value as any
      this.saveConfig()
    })

    // Accessibility settings
    const accessibilityMode = this.overlay.querySelector("#accessibility-mode") as HTMLInputElement
    const aslRequired = this.overlay.querySelector("#asl-required") as HTMLInputElement

    accessibilityMode?.addEventListener("change", (e) => {
      this.config.accessibilityMode = (e.target as HTMLInputElement).checked
      this.saveConfig()
    })

    aslRequired?.addEventListener("change", (e) => {
      this.config.aslRequired = (e.target as HTMLInputElement).checked
      this.saveConfig()
    })

    // AI query
    const askAI = this.overlay.querySelector("#ask-ai") as HTMLButtonElement
    const aiQuery = this.overlay.querySelector("#ai-query") as HTMLInputElement

    askAI?.addEventListener("click", () => {
      if (aiQuery.value.trim()) {
        this.queryGroqAI(aiQuery.value)
        aiQuery.value = ""
      }
    })

    // Start recording
    const startRecording = this.overlay.querySelector("#start-recording") as HTMLButtonElement
    startRecording?.addEventListener("click", () => {
      this.toggleRecording()
    })

    // Generate evidence
    const generateEvidence = this.overlay.querySelector("#generate-evidence") as HTMLButtonElement
    generateEvidence?.addEventListener("click", () => {
      this.generateVCodeEvidence()
    })
  }

  private async saveConfig() {
    await this.chrome.storage.sync.set({ vcode_config: this.config })
  }

  private async toggleRecording() {
    if (!this.isActive) {
      await this.startVCodeRecording()
    } else {
      await this.stopVCodeRecording()
    }
  }

  private async startVCodeRecording() {
    try {
      // Request microphone permission and start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      this.isActive = true
      this.updateUI("recording")

      // Start processing audio with Groq
      this.processAudioStream(stream)
    } catch (error) {
      console.error("Failed to start VCode recording:", error)
      this.updateTranscript("Error: Could not access microphone")
    }
  }

  private async stopVCodeRecording() {
    this.isActive = false
    this.updateUI("stopped")
  }

  private async processAudioStream(stream: MediaStream) {
    // This would integrate with the Groq API for real-time transcription
    // For now, simulate with periodic updates

    const interval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(interval)
        return
      }

      // Simulate receiving transcription from Groq
      const mockTranscript = "Simulated real-time transcription from Groq AI..."
      this.updateTranscript(mockTranscript)

      // Process with Groq AI for meeting assistance
      await this.processWithGroq(mockTranscript)
    }, 3000)
  }

  private async processWithGroq(transcript: string) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/groq/assistance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_transcript: transcript,
          meeting_context: {
            type: this.config.meetingType,
            accessibility_mode: this.config.accessibilityMode,
            asl_required: this.config.aslRequired,
          },
        }),
      })

      const result = await response.json()

      if (result.status === "success" && result.assistance) {
        this.updateAIResponse(result.assistance)
      }
    } catch (error) {
      console.error("Groq processing failed:", error)
    }
  }

  private async queryGroqAI(query: string) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/groq/assistance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_transcript: this.transcriptBuffer,
          meeting_context: {
            type: this.config.meetingType,
            accessibility_mode: this.config.accessibilityMode,
            asl_required: this.config.aslRequired,
          },
          user_query: query,
        }),
      })

      const result = await response.json()

      if (result.status === "success" && result.assistance) {
        this.updateAIResponse(result.assistance)
      }
    } catch (error) {
      console.error("AI query failed:", error)
      this.updateAIResponse("Error: Could not process AI query")
    }
  }

  private async generateVCodeEvidence() {
    if (!this.transcriptBuffer) {
      this.updateAIResponse("No transcript available for evidence generation")
      return
    }

    try {
      const response = await fetch(`${this.config.apiEndpoint}/groq/generate-evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_data: {
            transcript: this.transcriptBuffer,
            type: this.config.meetingType,
            platform: this.detectMeetingPlatform(),
          },
          legal_requirements: {
            accessibility_compliant: this.config.accessibilityMode,
            asl_interpreted: this.config.aslRequired,
          },
        }),
      })

      const result = await response.json()

      if (result.status === "success") {
        // Open VCode evidence in new tab
        const evidenceUrl = `https://vcode.pinksync.io/evidence/${result.evidence_id}`
        window.open(evidenceUrl, "_blank")
      }
    } catch (error) {
      console.error("Evidence generation failed:", error)
      this.updateAIResponse("Error: Could not generate VCode evidence")
    }
  }

  private updateUI(state: "recording" | "stopped") {
    if (!this.overlay) return

    const button = this.overlay.querySelector("#start-recording") as HTMLButtonElement
    const indicator = this.overlay.querySelector(".vcode-status-indicator") as HTMLElement

    if (state === "recording") {
      button.textContent = "Stop VCode"
      button.className = "vcode-button vcode-secondary"
      indicator.style.background = "#ef4444"
    } else {
      button.textContent = "Start VCode"
      button.className = "vcode-button vcode-primary"
      indicator.style.background = "#10b981"
    }
  }

  private updateTranscript(text: string) {
    if (!this.overlay) return

    const transcript = this.overlay.querySelector("#live-transcript") as HTMLElement
    this.transcriptBuffer += " " + text
    transcript.textContent = this.transcriptBuffer.slice(-500) // Keep last 500 chars
    transcript.scrollTop = transcript.scrollHeight
  }

  private updateAIResponse(response: string) {
    if (!this.overlay) return

    const aiResponse = this.overlay.querySelector("#ai-response") as HTMLElement
    aiResponse.textContent = response
    aiResponse.scrollTop = aiResponse.scrollHeight
  }
}

// Initialize VCode assistant when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new VCodeMeetingAssistant(window.chrome)
  })
} else {
  new VCodeMeetingAssistant(window.chrome)
}
