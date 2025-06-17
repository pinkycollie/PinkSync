// Deaf-First Icon System for 360 Magicians Platform

export interface DeafFirstIcon {
  name: string
  unicode: string
  description: string
  category: "communication" | "identity" | "accessibility" | "technology" | "community"
}

export const DEAF_FIRST_ICONS: Record<string, DeafFirstIcon> = {
  // Primary Deaf Identity Icons
  deaf_person: {
    name: "deaf_person",
    unicode: "🧏",
    description: "Deaf person - primary identity icon",
    category: "identity",
  },

  ear: {
    name: "ear",
    unicode: "👂",
    description: "Ear - hearing/deaf awareness",
    category: "identity",
  },

  ear_with_hearing_aid: {
    name: "ear_with_hearing_aid",
    unicode: "🦻",
    description: "Ear with hearing aid - hard of hearing",
    category: "identity",
  },

  // Sign Language Communication
  sign_language: {
    name: "sign_language",
    unicode: "🤟",
    description: "I love you sign - ASL",
    category: "communication",
  },

  raised_hand: {
    name: "raised_hand",
    unicode: "✋",
    description: "Raised hand - attention/communication",
    category: "communication",
  },

  ok_hand: {
    name: "ok_hand",
    unicode: "👌",
    description: "OK hand sign",
    category: "communication",
  },

  thumbs_up: {
    name: "thumbs_up",
    unicode: "👍",
    description: "Thumbs up - positive feedback",
    category: "communication",
  },

  pointing_finger: {
    name: "pointing_finger",
    unicode: "👉",
    description: "Pointing finger - direction/attention",
    category: "communication",
  },

  // Visual Communication
  eyes: {
    name: "eyes",
    unicode: "👀",
    description: "Eyes - visual communication focus",
    category: "communication",
  },

  eye: {
    name: "eye",
    unicode: "👁️",
    description: "Single eye - visual attention",
    category: "communication",
  },

  // Technology & Accessibility
  mobile_phone: {
    name: "mobile_phone",
    unicode: "📱",
    description: "Mobile phone - accessible technology",
    category: "technology",
  },

  computer: {
    name: "computer",
    unicode: "💻",
    description: "Computer - digital accessibility",
    category: "technology",
  },

  video_camera: {
    name: "video_camera",
    unicode: "📹",
    description: "Video camera - sign language recording",
    category: "technology",
  },

  television: {
    name: "television",
    unicode: "📺",
    description: "Television - captioned media",
    category: "technology",
  },

  // Visual Alerts & Notifications
  light_bulb: {
    name: "light_bulb",
    unicode: "💡",
    description: "Light bulb - visual alerts",
    category: "accessibility",
  },

  warning: {
    name: "warning",
    unicode: "⚠️",
    description: "Warning - visual alert",
    category: "accessibility",
  },

  bell: {
    name: "bell",
    unicode: "🔔",
    description: "Bell - notification (visual context)",
    category: "accessibility",
  },

  flashlight: {
    name: "flashlight",
    unicode: "🔦",
    description: "Flashlight - visual signaling",
    category: "accessibility",
  },

  // Community & Support
  handshake: {
    name: "handshake",
    unicode: "🤝",
    description: "Handshake - community connection",
    category: "community",
  },

  people_holding_hands: {
    name: "people_holding_hands",
    unicode: "🧑‍🤝‍🧑",
    description: "People holding hands - community support",
    category: "community",
  },

  heart: {
    name: "heart",
    unicode: "❤️",
    description: "Heart - community love and support",
    category: "community",
  },

  // Business & Professional
  briefcase: {
    name: "briefcase",
    unicode: "💼",
    description: "Briefcase - professional/business",
    category: "technology",
  },

  chart_increasing: {
    name: "chart_increasing",
    unicode: "📈",
    description: "Chart increasing - business growth",
    category: "technology",
  },

  magic_wand: {
    name: "magic_wand",
    unicode: "🪄",
    description: "Magic wand - 360 Magicians brand",
    category: "technology",
  },
}

// Icon mapping for different contexts
export const MAGICIAN_ICONS = {
  auth: DEAF_FIRST_ICONS.deaf_person,
  sync: DEAF_FIRST_ICONS.eyes,
  neural: DEAF_FIRST_ICONS.light_bulb,
  business: DEAF_FIRST_ICONS.magic_wand,
  job: DEAF_FIRST_ICONS.briefcase,
  community: DEAF_FIRST_ICONS.handshake,
}

// Accessibility feature icons
export const ACCESSIBILITY_ICONS = {
  sign_language_support: DEAF_FIRST_ICONS.sign_language,
  visual_alerts: DEAF_FIRST_ICONS.light_bulb,
  captions: DEAF_FIRST_ICONS.television,
  video_relay: DEAF_FIRST_ICONS.video_camera,
  text_communication: DEAF_FIRST_ICONS.mobile_phone,
  hearing_aid_compatible: DEAF_FIRST_ICONS.ear_with_hearing_aid,
  deaf_friendly: DEAF_FIRST_ICONS.ear,
}

// Function to get appropriate icon for context
export function getDeafFirstIcon(context: string, fallback?: string): string {
  const icon =
    DEAF_FIRST_ICONS[context] || ACCESSIBILITY_ICONS[context] || MAGICIAN_ICONS[context as keyof typeof MAGICIAN_ICONS]
  return icon?.unicode || fallback || DEAF_FIRST_ICONS.deaf_person.unicode
}

// SVG icon definitions for web use
export const DEAF_FIRST_SVG_ICONS = {
  deaf_person: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 11.8 12.8 14 10 14C7.2 14 5 11.8 5 9V7L3 7.5V9C3 12.5 5.6 15.4 9 15.9V18H7V20H17V18H15V15.9C18.4 15.4 21 12.5 21 9Z"/>
      <circle cx="12" cy="9" r="3"/>
      <path d="M8 12L10 14L16 8" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  `,

  sign_language: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
      <path d="M8 18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V16H8V18Z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  `,

  visual_alert: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
      <circle cx="12" cy="19" r="3" opacity="0.7"/>
    </svg>
  `,

  ear_icon: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 20C17 21.1 16.1 22 15 22H9C7.9 22 7 21.1 7 20V19H17V20ZM12 2C8.7 2 6 4.7 6 8V13C6 15.2 7.8 17 10 17H14C16.2 17 18 15.2 18 13V8C18 4.7 15.3 2 12 2ZM12 4C14.2 4 16 5.8 16 8V13C16 14.1 15.1 15 14 15H10C8.9 15 8 14.1 8 13V8C8 5.8 9.8 4 12 4Z"/>
      <circle cx="12" cy="8" r="2"/>
    </svg>
  `,
}
