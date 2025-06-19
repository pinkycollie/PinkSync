-- Create user accessibility preferences table
CREATE TABLE IF NOT EXISTS user_accessibility_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    communication_method TEXT NOT NULL DEFAULT 'text',
    visual_preferences JSONB NOT NULL DEFAULT '{
        "high_contrast": false,
        "large_text": false,
        "color_scheme": "default"
    }',
    caption_preferences JSONB NOT NULL DEFAULT '{
        "enabled": true,
        "size": "medium",
        "position": "bottom",
        "language": "en"
    }',
    sign_language_preferences JSONB NOT NULL DEFAULT '{
        "enabled": false,
        "dialect": "asl",
        "avatar_style": "realistic"
    }',
    voice_preferences JSONB NOT NULL DEFAULT '{
        "text_to_speech": false,
        "speech_to_text": false,
        "voice_type": "neutral"
    }',
    haptic_feedback BOOLEAN NOT NULL DEFAULT false,
    auto_adapt BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user interaction history table
CREATE TABLE IF NOT EXISTS user_interaction_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    preferences_used JSONB NOT NULL,
    engagement_metrics JSONB NOT NULL,
    feedback JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_accessibility_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interaction_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences"
    ON user_accessibility_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_accessibility_preferences
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON user_accessibility_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interaction history"
    ON user_interaction_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
    ON user_interaction_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON user_accessibility_preferences(user_id);
CREATE INDEX idx_user_interactions_user_id ON user_interaction_history(user_id);
CREATE INDEX idx_user_interactions_type ON user_interaction_history(interaction_type);
CREATE INDEX idx_user_interactions_content ON user_interaction_history(content_id); 