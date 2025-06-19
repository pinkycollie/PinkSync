-- Create user accessibility preferences table
CREATE TABLE IF NOT EXISTS user_accessibility_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  communication_method VARCHAR(50) NOT NULL DEFAULT 'text', -- text, sign_language, voice, etc.
  visual_preferences JSONB DEFAULT '{"high_contrast": false, "large_text": false, "color_scheme": "default"}',
  caption_preferences JSONB DEFAULT '{"enabled": true, "size": "medium", "position": "bottom", "language": "en"}',
  sign_language_preferences JSONB DEFAULT '{"enabled": false, "dialect": "asl", "avatar_style": "realistic"}',
  voice_preferences JSONB DEFAULT '{"text_to_speech": false, "speech_to_text": false, "voice_type": "neutral"}',
  haptic_feedback BOOLEAN DEFAULT false,
  auto_adapt BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user interaction history table for adaptive learning
CREATE TABLE IF NOT EXISTS user_interaction_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- video_watch, text_read, sign_language_view, etc.
  content_id TEXT, -- ID of the content interacted with
  preferences_used JSONB, -- Snapshot of preferences used during this interaction
  engagement_metrics JSONB, -- Time spent, completion rate, etc.
  feedback JSONB, -- User feedback if provided
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create content accessibility versions table
CREATE TABLE IF NOT EXISTS content_accessibility_versions (
  id SERIAL PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- video, article, interface, etc.
  version_type VARCHAR(50) NOT NULL, -- original, sign_language, high_contrast, etc.
  content_url TEXT, -- URL to the content version
  metadata JSONB, -- Additional metadata about this version
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
