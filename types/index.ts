/**
 * Core Type Definitions for PinkSync Platform
 */

// User Types
export interface DeafUser {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: AccessibilityPreferences;
  deafAuthVerified: boolean;
  mbtqIntegration?: MbtqIntegration;
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
  colorScheme?: 'light' | 'dark' | 'high-contrast';
  fontSize?: 'small' | 'medium' | 'large' | 'x-large';
  animations?: boolean;
}

// Event System Types
export interface PlatformEvent {
  id: string;
  type: EventType;
  source: EventSource;
  timestamp: Date;
  payload: any;
  userId?: string;
  metadata?: Record<string, any>;
}

export type EventType =
  | 'user.auth'
  | 'user.preference.update'
  | 'content.transform'
  | 'service.request'
  | 'signal.received'
  | 'notification.triggered'
  | 'provider.update'
  | 'community.feedback'
  | 'research.indexed'
  | 'worker.completed';

export type EventSource =
  | 'web'
  | 'extension'
  | 'embedded'
  | 'api'
  | 'worker'
  | 'signal'
  | 'notificator';

// Service Provider Types
export interface ServiceProvider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  apiEndpoint: string;
  capabilities: ProviderCapability[];
  accessibilityScore: number;
  active: boolean;
  metadata?: Record<string, any>;
}

export type ProviderType =
  | 'vocational-rehabilitation'
  | 'education'
  | 'employment'
  | 'healthcare'
  | 'community'
  | 'government'
  | 'enterprise'
  | 'other';

export interface ProviderCapability {
  name: string;
  description: string;
  endpoint: string;
  parameters?: Record<string, any>;
}

// Research & RAG Types
export interface ResearchDocument {
  id: string;
  title: string;
  content: string;
  source: string;
  type: ResearchType;
  tags: string[];
  embedding?: number[];
  communityVotes: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ResearchType =
  | 'accessibility-guideline'
  | 'community-feedback'
  | 'usage-pattern'
  | 'best-practice'
  | 'provider-review'
  | 'technical-documentation';

export interface VectorSearchQuery {
  query: string;
  topK?: number;
  filter?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface VectorSearchResult {
  document: ResearchDocument;
  score: number;
  metadata?: Record<string, any>;
}

// Worker Types
export interface BackgroundJob {
  id: string;
  type: JobType;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: JobStatus;
  payload: any;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  maxRetries: number;
}

export type JobType =
  | 'content.simplify'
  | 'content.translate'
  | 'provider.sync'
  | 'research.index'
  | 'user.match'
  | 'notification.send'
  | 'analytics.process';

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

// PinkFlow Types
export interface ContentTransformation {
  id: string;
  originalContent: string;
  transformedContent: string;
  transformationType: TransformationType;
  userId?: string;
  metadata: TransformationMetadata;
  createdAt: Date;
}

export type TransformationType =
  | 'simplify'
  | 'visualize'
  | 'transcribe'
  | 'sign-language'
  | 'structure';

export interface TransformationMetadata {
  complexity: number;
  readabilityScore: number;
  confidence: number;
  processingTime: number;
  engine: string;
}

// Signal & Notification Types
export interface Signal {
  id: string;
  type: SignalType;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  source: string;
  target: string[];
  payload: any;
  deliveredAt?: Date;
  acknowledgedAt?: Date;
}

export type SignalType =
  | 'system.alert'
  | 'user.message'
  | 'service.update'
  | 'content.available'
  | 'provider.notification';

export interface NotificationConfig {
  enabled: boolean;
  visual: boolean;
  vibration: boolean;
  sound: boolean;
  customStyles?: Record<string, any>;
}

// MBTQ Integration Types
export interface MbtqIntegration {
  enabled: boolean;
  userId: string;
  syncEnabled: boolean;
  sharedPreferences: boolean;
  lastSync?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Configuration Types
export interface EnvironmentConfig {
  environment: string;
  apiUrl: string;
  features: Record<string, boolean>;
  debug: boolean;
}
