import { DEAF_FIRST_ICONS } from "./deaf-first-icons"

export interface MagicianBranding {
  name: string
  icon: string
  color: string
  description: string
  deafFirstFeatures: string[]
}

export const MAGICIANS_BRANDING: Record<string, MagicianBranding> = {
  auth: {
    name: "360 Auth Magician",
    icon: DEAF_FIRST_ICONS.deaf_person.unicode,
    color: "#6366F1",
    description: "Magical sign language authentication",
    deafFirstFeatures: [
      "Sign language video authentication",
      "Visual biometric patterns",
      "Deaf cultural identity support",
      "Multi-device deaf profile sync",
    ],
  },

  sync: {
    name: "360 Sync Magician",
    icon: DEAF_FIRST_ICONS.eyes.unicode,
    color: "#8B5CF6",
    description: "Visual-first data synchronization magic",
    deafFirstFeatures: [
      "Visual sync indicators",
      "Offline-first for deaf users",
      "Sign language preference sync",
      "Visual conflict resolution",
    ],
  },

  neural: {
    name: "360 Neural Magician",
    icon: DEAF_FIRST_ICONS.light_bulb.unicode,
    color: "#F59E0B",
    description: "AI-powered deaf-first processing magic",
    deafFirstFeatures: [
      "Sign language recognition AI",
      "Visual gesture analysis",
      "Deaf accessibility optimization",
      "Cultural context understanding",
    ],
  },

  business: {
    name: "360 Business Magician",
    icon: DEAF_FIRST_ICONS.magic_wand.unicode,
    color: "#10B981",
    description: "Magical business automation for deaf entrepreneurs",
    deafFirstFeatures: [
      "Deaf entrepreneur business setup",
      "Visual business process automation",
      "Sign language customer support",
      "Deaf-friendly vendor connections",
    ],
  },

  job: {
    name: "360 Job Magician",
    icon: DEAF_FIRST_ICONS.briefcase.unicode,
    color: "#EF4444",
    description: "Magical job opportunities for deaf professionals",
    deafFirstFeatures: [
      "Deaf-friendly job filtering",
      "Sign language skill matching",
      "Visual interview preparation",
      "Workplace accommodation guidance",
    ],
  },

  community: {
    name: "360 Community Magician",
    icon: DEAF_FIRST_ICONS.handshake.unicode,
    color: "#3B82F6",
    description: "Magical deaf community connections",
    deafFirstFeatures: [
      "Deaf community networking",
      "Sign language event discovery",
      "Cultural celebration alerts",
      "Deaf advocacy tools",
    ],
  },
}

// Platform-wide deaf-first accessibility indicators
export const DEAF_ACCESSIBILITY_INDICATORS = {
  sign_language_supported: {
    icon: DEAF_FIRST_ICONS.sign_language.unicode,
    label: "Sign Language Supported",
    color: "#3B82F6",
  },

  visual_alerts_enabled: {
    icon: DEAF_FIRST_ICONS.light_bulb.unicode,
    label: "Visual Alerts Enabled",
    color: "#F59E0B",
  },

  deaf_friendly_employer: {
    icon: DEAF_FIRST_ICONS.ear.unicode,
    label: "Deaf-Friendly Employer",
    color: "#10B981",
  },

  captions_available: {
    icon: DEAF_FIRST_ICONS.television.unicode,
    label: "Captions Available",
    color: "#6366F1",
  },

  video_relay_supported: {
    icon: DEAF_FIRST_ICONS.video_camera.unicode,
    label: "Video Relay Supported",
    color: "#8B5CF6",
  },

  text_communication: {
    icon: DEAF_FIRST_ICONS.mobile_phone.unicode,
    label: "Text Communication Preferred",
    color: "#EF4444",
  },
}

// Function to generate deaf-first UI components
export function generateDeafFirstComponent(type: "button" | "card" | "alert", content: any) {
  const baseClasses = "deaf-first-component"

  switch (type) {
    case "button":
      return {
        className: `${baseClasses} deaf-button visual-feedback high-contrast`,
        "aria-label": content.label,
        "data-deaf-optimized": "true",
        style: {
          border: "2px solid currentColor",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          cursor: "pointer",
        },
      }

    case "card":
      return {
        className: `${baseClasses} deaf-card visual-hierarchy`,
        "data-deaf-optimized": "true",
        style: {
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      }

    case "alert":
      return {
        className: `${baseClasses} deaf-alert visual-priority`,
        role: "alert",
        "aria-live": "assertive",
        "data-deaf-optimized": "true",
        style: {
          border: "3px solid #F59E0B",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          fontWeight: "bold",
        },
      }

    default:
      return {}
  }
}

// CSS classes for deaf-first design system
export const DEAF_FIRST_CSS = `
  .deaf-first-component {
    /* High contrast by default */
    --deaf-primary: #000000;
    --deaf-secondary: #ffffff;
    --deaf-accent: #F59E0B;
    --deaf-success: #10B981;
    --deaf-warning: #F59E0B;
    --deaf-error: #EF4444;
  }
  
  .deaf-button {
    position: relative;
    overflow: hidden;
  }
  
  .deaf-button:hover,
  .deaf-button:focus {
    transform: scale(1.05);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
  
  .deaf-button:active {
    transform: scale(0.98);
  }
  
  .visual-feedback::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
  }
  
  .visual-feedback:hover::after {
    left: 100%;
  }
  
  .deaf-card {
    transition: all 0.3s ease;
  }
  
  .deaf-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  .deaf-alert {
    animation: deaf-alert-pulse 2s infinite;
  }
  
  @keyframes deaf-alert-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  /* High contrast mode */
  @media (prefers-contrast: high) {
    .deaf-first-component {
      --deaf-primary: #000000;
      --deaf-secondary: #ffffff;
      border-width: 3px !important;
      font-weight: bold !important;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .deaf-first-component,
    .deaf-first-component * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`
