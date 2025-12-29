/**
 * DeafAUTH Type Definitions for Deno
 * 
 * Standalone types that work without Next.js dependencies
 */

// User Types
export interface DeafUser {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: AccessibilityPreferences;
  deafAuthVerified: boolean;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  location?: string;
  deafCommunity?: string[];
  communicationPreferences: CommunicationPreferences;
}

export interface CommunicationPreferences {
  preferredLanguage: string;
  signLanguageDialect?: string;
  textComplexity: 'simple' | 'standard' | 'complex';
  visualAids: boolean;
  captioning: boolean;
}

export interface AccessibilityPreferences {
  simplifyText: boolean;
  visualEnhancements: boolean;
  signLanguage: boolean;
  transcription: boolean;
  captioning?: boolean;
  colorScheme?: 'light' | 'dark' | 'high-contrast';
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  animations?: boolean;
}

// Auth Types
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface VisualVerification {
  pattern: string[];
  type: 'image-selection' | 'pattern-matching' | 'gesture-based';
}

export interface AuthResult {
  success: boolean;
  user?: DeafUser;
  token?: string;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
