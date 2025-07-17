-- User Government Tokens (OAuth tokens from direct user authentication)
CREATE TABLE user_government_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL, -- 'login.gov', 'myssa', 'irs', 'id.me'
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- User Government Profiles (Profile data from government services)
CREATE TABLE user_government_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL,
  profile_data JSONB NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- Government Data Sync Log
CREATE TABLE government_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL,
  sync_type VARCHAR(50) NOT NULL, -- 'manual', 'scheduled', 'webhook'
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  sync_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Government Service Permissions
CREATE TABLE government_service_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL,
  permission_type VARCHAR(100) NOT NULL, -- 'read_benefits', 'read_tax_info', etc.
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, service, permission_type)
);

-- Indexes for performance
CREATE INDEX idx_user_government_tokens_user_service ON user_government_tokens(user_id, service);
CREATE INDEX idx_user_government_profiles_user_service ON user_government_profiles(user_id, service);
CREATE INDEX idx_government_sync_log_user_service ON government_sync_log(user_id, service);
CREATE INDEX idx_government_sync_log_created_at ON government_sync_log(created_at);
