-- Family Monitoring Database Schema

-- Family Units Table
CREATE TABLE family_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    family_name VARCHAR(255) NOT NULL,
    household_size INTEGER NOT NULL,
    primary_communication_method VARCHAR(50),
    accessibility_needs TEXT, -- JSON
    emergency_contact_preferences TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Members Table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    relationship VARCHAR(20) NOT NULL, -- 'spouse', 'child', 'parent', 'sibling', 'grandparent', 'guardian', 'dependent'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    hearing_status VARCHAR(20) NOT NULL, -- 'deaf', 'hard_of_hearing', 'hearing', 'unknown'
    primary_communication VARCHAR(50),
    dependent_status BOOLEAN DEFAULT FALSE,
    beneficiary_status BOOLEAN DEFAULT FALSE,
    emergency_contact BOOLEAN DEFAULT FALSE,
    consent_to_monitor BOOLEAN DEFAULT FALSE,
    ssn_encrypted TEXT, -- Encrypted SSN for benefit tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Benefit Opportunities Table
CREATE TABLE family_benefit_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    benefit_type VARCHAR(30) NOT NULL, -- 'education', 'healthcare', 'tax_credit', 'caregiver_support', 'accessibility', 'emergency_services'
    eligible_members TEXT NOT NULL, -- JSON array of member IDs
    benefit_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    potential_value DECIMAL(10,2) DEFAULT 0,
    application_deadline DATE,
    requirements TEXT, -- JSON array of requirements
    status VARCHAR(20) DEFAULT 'discovered', -- 'discovered', 'eligible', 'applied', 'approved', 'denied'
    priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    application_url TEXT,
    contact_information TEXT, -- JSON
    documentation_needed TEXT, -- JSON array
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(family_id, benefit_name)
);

-- Family Member Monitoring Configuration
CREATE TABLE family_member_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    monitoring_config TEXT NOT NULL, -- JSON configuration
    alert_preferences TEXT, -- JSON
    last_check TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Accessibility Profiles
CREATE TABLE family_accessibility_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    household_communication TEXT, -- JSON array of communication methods
    emergency_protocols TEXT, -- JSON
    accessibility_needs TEXT, -- JSON
    interpreter_services BOOLEAN DEFAULT FALSE,
    visual_alert_systems BOOLEAN DEFAULT FALSE,
    assistive_technology TEXT, -- JSON array
    educational_support TEXT, -- JSON
    caregiver_support TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Benefit Applications Tracking
CREATE TABLE family_benefit_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES family_benefit_opportunities(id) ON DELETE CASCADE,
    applicant_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    application_date DATE NOT NULL,
    application_status VARCHAR(20) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'denied', 'pending_info'
    application_reference VARCHAR(100),
    estimated_decision_date DATE,
    actual_decision_date DATE,
    benefit_start_date DATE,
    benefit_end_date DATE,
    monthly_benefit_amount DECIMAL(8,2),
    annual_benefit_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Emergency Contacts
CREATE TABLE family_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    contact_type VARCHAR(30) NOT NULL, -- 'primary', 'secondary', 'medical', 'interpreter', 'school', 'work'
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    preferred_communication VARCHAR(30), -- 'voice', 'text', 'email', 'video', 'relay'
    available_hours VARCHAR(100),
    special_instructions TEXT,
    is_deaf_aware BOOLEAN DEFAULT FALSE,
    can_sign BOOLEAN DEFAULT FALSE,
    priority_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Communication Preferences
CREATE TABLE family_communication_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    communication_method VARCHAR(30) NOT NULL, -- 'ASL', 'PSE', 'oral', 'written', 'text', 'email', 'video'
    proficiency_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'native'
    preferred_for_emergency BOOLEAN DEFAULT FALSE,
    preferred_for_medical BOOLEAN DEFAULT FALSE,
    preferred_for_education BOOLEAN DEFAULT FALSE,
    preferred_for_legal BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Benefit History
CREATE TABLE family_benefit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    benefit_name VARCHAR(255) NOT NULL,
    benefit_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_amount DECIMAL(8,2),
    annual_amount DECIMAL(10,2),
    provider_agency VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'transferred'
    renewal_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_hearing_status ON family_members(hearing_status);
CREATE INDEX idx_family_benefit_opportunities_family_id ON family_benefit_opportunities(family_id);
CREATE INDEX idx_family_benefit_opportunities_status ON family_benefit_opportunities(status);
CREATE INDEX idx_family_benefit_opportunities_priority ON family_benefit_opportunities(priority);
CREATE INDEX idx_family_benefit_applications_family_id ON family_benefit_applications(family_id);
CREATE INDEX idx_family_benefit_applications_status ON family_benefit_applications(application_status);
CREATE INDEX idx_family_emergency_contacts_family_id ON family_emergency_contacts(family_id);
CREATE INDEX idx_family_communication_preferences_family_id ON family_communication_preferences(family_id);
CREATE INDEX idx_family_benefit_history_family_id ON family_benefit_history(family_id);
CREATE INDEX idx_family_benefit_history_member_id ON family_benefit_history(member_id);
