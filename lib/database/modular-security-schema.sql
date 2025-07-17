-- Modular Identity System Database Schema

-- Core modular identities table
CREATE TABLE IF NOT EXISTS modular_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id VARCHAR(255) UNIQUE NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  module_type VARCHAR(50) NOT NULL,
  isolated_credentials JSONB NOT NULL,
  data_isolation JSONB NOT NULL,
  security_policy JSONB NOT NULL,
  breach_containment JSONB NOT NULL,
  audit_trail JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  isolated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Module connections tracking
CREATE TABLE IF NOT EXISTS module_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id VARCHAR(255) NOT NULL,
  connection_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  permissions JSONB,
  isolation_boundary VARCHAR(255),
  last_used TIMESTAMP,
  suspended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Module sessions with isolation
CREATE TABLE IF NOT EXISTS module_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(255) NOT NULL,
  session_token VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  ip_address INET,
  user_agent TEXT,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Module tokens for API access
CREATE TABLE IF NOT EXISTS module_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(512) NOT NULL,
  token_type VARCHAR(50) NOT NULL,
  permissions JSONB,
  expires_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Cross-module permissions (limited and time-bound)
CREATE TABLE IF NOT EXISTS cross_module_permissions (
  id VARCHAR(255) PRIMARY KEY,
  source_module_id VARCHAR(255) NOT NULL,
  target_module_id VARCHAR(255) NOT NULL,
  permissions JSONB NOT NULL,
  conditions JSONB,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (source_module_id) REFERENCES modular_identities(module_id),
  FOREIGN KEY (target_module_id) REFERENCES modular_identities(module_id)
);

-- Security events and audit trail
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(255),
  user_id UUID,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  severity VARCHAR(20),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Breach detection and response
CREATE TABLE IF NOT EXISTS breach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(255) NOT NULL,
  policy_id VARCHAR(255),
  breach_type VARCHAR(100),
  indicators JSONB,
  severity VARCHAR(20),
  confidence_score DECIMAL(3,2),
  detected_at TIMESTAMP DEFAULT NOW(),
  contained_at TIMESTAMP,
  resolved_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  response_actions JSONB,
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Module isolation audit
CREATE TABLE IF NOT EXISTS module_isolation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(255) NOT NULL,
  isolation_action VARCHAR(100) NOT NULL,
  reason TEXT,
  triggered_by VARCHAR(255),
  isolation_level VARCHAR(50),
  data_quarantined BOOLEAN DEFAULT false,
  recovery_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (module_id) REFERENCES modular_identities(module_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_modular_identities_user_id ON modular_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_modular_identities_module_type ON modular_identities(module_type);
CREATE INDEX IF NOT EXISTS idx_modular_identities_status ON modular_identities(status);
CREATE INDEX IF NOT EXISTS idx_module_connections_user_id ON module_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_module_connections_status ON module_connections(status);
CREATE INDEX IF NOT EXISTS idx_module_sessions_module_id ON module_sessions(module_id);
CREATE INDEX IF NOT EXISTS idx_module_sessions_status ON module_sessions(status);
CREATE INDEX IF NOT EXISTS idx_security_events_module_id ON security_events(module_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_breach_events_module_id ON breach_events(module_id);
CREATE INDEX IF NOT EXISTS idx_breach_events_status ON breach_events(status);

-- Row Level Security policies
ALTER TABLE modular_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only access their own modules
CREATE POLICY user_module_access ON modular_identities
  FOR ALL TO authenticated_users
  USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY user_connection_access ON module_connections
  FOR ALL TO authenticated_users
  USING (user_id = current_setting('app.current_user_id')::UUID);

-- Trigger for automatic audit trail updates
CREATE OR REPLACE FUNCTION update_module_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  NEW.audit_trail = jsonb_set(
    COALESCE(NEW.audit_trail, '{}'),
    '{lastModified}',
    to_jsonb(NOW())
  );
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER modular_identities_audit_trigger
  BEFORE UPDATE ON modular_identities
  FOR EACH ROW
  EXECUTE FUNCTION update_module_audit_trail();

-- Function to automatically isolate modules on breach detection
CREATE OR REPLACE FUNCTION auto_isolate_on_breach()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'critical' AND NEW.confidence_score > 0.9 THEN
    UPDATE modular_identities 
    SET status = 'isolated', isolated_at = NOW()
    WHERE module_id = NEW.module_id;
    
    UPDATE module_sessions 
    SET status = 'revoked', revoked_at = NOW()
    WHERE module_id = NEW.module_id AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER breach_auto_isolation_trigger
  AFTER INSERT ON breach_events
  FOR EACH ROW
  EXECUTE FUNCTION auto_isolate_on_breach();
