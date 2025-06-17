-- PINKSYNC Database Integration Migration
-- Integrating existing tables with new PINKSYNC schema

-- Extend existing profiles table for PINKSYNC users
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  sign_language VARCHAR(10) DEFAULT 'asl',
  regional_variant VARCHAR(50),
  accessibility_preferences JSONB DEFAULT '{}',
  verification_status VARCHAR(20) DEFAULT 'pending',
  trust_score INTEGER DEFAULT 0,
  deaf_creator_verified BOOLEAN DEFAULT FALSE;

-- Create PINKSYNC-specific tables that integrate with existing schema

-- User biometrics for sign language authentication
CREATE TABLE IF NOT EXISTS user_biometrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  biometric_templates BYTEA[],
  motion_password_hash VARCHAR(255),
  template_version VARCHAR(10) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  failed_attempts INTEGER DEFAULT 0,
  lockout_status BOOLEAN DEFAULT FALSE
);

-- Video content table (extends existing analyses)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'uploading',
  duration INTEGER,
  url TEXT,
  thumbnail_url TEXT,
  sign_language VARCHAR(10) DEFAULT 'asl',
  metadata JSONB DEFAULT '{}',
  processing_status JSONB DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trust badges and verification
CREATE TABLE IF NOT EXISTS trust_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  criteria TEXT,
  issuer VARCHAR(100),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  verification_url TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Verification submissions
CREATE TABLE IF NOT EXISTS verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  documents JSONB DEFAULT '[]',
  notes TEXT,
  reviewer_id UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- User sessions for cross-platform auth
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  device_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auth_method VARCHAR(30) DEFAULT 'traditional',
  status VARCHAR(20) DEFAULT 'active'
);

-- Notifications with visual feedback
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  visual_feedback JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks and progress tracking
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'not_started',
  percent_complete INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES profiles(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_sign_language ON videos(sign_language);
CREATE INDEX IF NOT EXISTS idx_trust_badges_user_id ON trust_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_user_id ON verification_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_submissions_status ON verification_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Update existing deaf_creator table to link with profiles
ALTER TABLE deaf_creator ADD COLUMN IF NOT EXISTS 
  profile_id UUID REFERENCES profiles(id),
  verification_level VARCHAR(20) DEFAULT 'basic',
  specializations TEXT[],
  portfolio_url TEXT;

-- Create views for common queries
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  p.id,
  p.email,
  p.tier,
  p.credits,
  p.sign_language,
  p.accessibility_preferences,
  p.verification_status,
  p.trust_score,
  COUNT(v.id) as video_count,
  COUNT(tb.id) as badge_count,
  COUNT(CASE WHEN n.read = FALSE THEN 1 END) as unread_notifications
FROM profiles p
LEFT JOIN videos v ON p.id = v.user_id
LEFT JOIN trust_badges tb ON p.id = tb.user_id  
LEFT JOIN notifications n ON p.id = n.user_id
GROUP BY p.id, p.email, p.tier, p.credits, p.sign_language, 
         p.accessibility_preferences, p.verification_status, p.trust_score;

-- Create function for updating trust scores
CREATE OR REPLACE FUNCTION update_trust_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  badge_count INTEGER;
  verification_count INTEGER;
  video_count INTEGER;
BEGIN
  -- Count badges
  SELECT COUNT(*) INTO badge_count FROM trust_badges WHERE user_id = user_uuid;
  
  -- Count verifications
  SELECT COUNT(*) INTO verification_count 
  FROM verification_submissions 
  WHERE user_id = user_uuid AND status = 'approved';
  
  -- Count videos
  SELECT COUNT(*) INTO video_count FROM videos WHERE user_id = user_uuid;
  
  -- Calculate score
  score := (badge_count * 20) + (verification_count * 30) + (video_count * 5);
  
  -- Update profile
  UPDATE profiles SET trust_score = score WHERE id = user_uuid;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic trust score updates
CREATE OR REPLACE FUNCTION trigger_update_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_trust_score(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trust_badge_update ON trust_badges;
CREATE TRIGGER trust_badge_update
  AFTER INSERT OR UPDATE ON trust_badges
  FOR EACH ROW EXECUTE FUNCTION trigger_update_trust_score();

DROP TRIGGER IF EXISTS verification_update ON verification_submissions;
CREATE TRIGGER verification_update
  AFTER UPDATE ON verification_submissions
  FOR EACH ROW EXECUTE FUNCTION trigger_update_trust_score();
