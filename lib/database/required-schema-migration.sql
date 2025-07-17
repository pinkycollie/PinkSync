-- Critical Missing Tables for DeafLifeOS

-- 1. DEAF IDENTITY VERIFICATION (Critical - Immediate)
CREATE TABLE IF NOT EXISTS deaf_identity_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  hearing_loss_type VARCHAR(50) NOT NULL,
  hearing_loss_degree VARCHAR(50) NOT NULL,
  primary_communication VARCHAR(50) NOT NULL,
  verification_status VARCHAR(50) DEFAULT 'pending',
  verification_documents JSONB,
  community_verifiers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MODULAR SECURITY SYSTEM (Critical - Immediate)
CREATE TABLE IF NOT EXISTS modular_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  module_id VARCHAR(255) UNIQUE NOT NULL,
  module_type VARCHAR(50) NOT NULL,
  isolated_credentials JSONB NOT NULL,
  security_policy JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GOVERNMENT CONNECTIONS (Critical - Immediate)
CREATE TABLE IF NOT EXISTS government_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  agency_name VARCHAR(255) NOT NULL,
  connection_type VARCHAR(100) NOT NULL,
  connection_status VARCHAR(50) DEFAULT 'pending',
  api_credentials JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EMERGENCY PROFILES (Critical - Immediate)
CREATE TABLE IF NOT EXISTS emergency_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  emergency_contacts JSONB NOT NULL,
  medical_conditions JSONB,
  communication_preferences JSONB NOT NULL,
  location_sharing_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAMILY UNITS (High Priority - Phase 1)
CREATE TABLE IF NOT EXISTS family_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_user_id UUID NOT NULL REFERENCES profiles(id),
  family_name VARCHAR(255),
  household_size INTEGER,
  primary_communication VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FAMILY MEMBERS (High Priority - Phase 1)
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES family_units(id),
  relationship VARCHAR(50) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  hearing_status VARCHAR(50),
  dependent_status BOOLEAN DEFAULT false,
  consent_to_monitor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. HEALTH PROFILES (Critical - Phase 1)
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  hearing_loss_details JSONB,
  medical_conditions JSONB,
  medications JSONB,
  healthcare_providers JSONB,
  insurance_info JSONB,
  accessibility_needs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FINANCIAL ACCOUNTS (High Priority - Phase 1)
CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  account_type VARCHAR(100) NOT NULL,
  institution_name VARCHAR(255),
  account_status VARCHAR(50) DEFAULT 'active',
  balance_tracking BOOLEAN DEFAULT false,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. COMMUNITY PROFILES (Medium Priority - Phase 2)
CREATE TABLE IF NOT EXISTS community_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  community_role VARCHAR(100),
  participation_level VARCHAR(50),
  interests JSONB,
  skills JSONB,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. IMPACT TRACKING (High Priority - Phase 1)
CREATE TABLE IF NOT EXISTS impact_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  metric_type VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,2),
  measurement_date DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deaf_identity_user_id ON deaf_identity_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_modular_identities_user_id ON modular_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_government_connections_user_id ON government_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_profiles_user_id ON emergency_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_id ON health_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_user_id ON financial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_impact_tracking_user_id ON impact_tracking(user_id);
