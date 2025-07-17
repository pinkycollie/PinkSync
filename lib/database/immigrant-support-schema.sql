-- Immigrant Support Database Schema

-- Immigrant Family Profiles
CREATE TABLE immigrant_family_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    immigration_status VARCHAR(30) NOT NULL, -- 'citizen', 'permanent_resident', 'refugee', 'asylum_seeker', 'temporary_protected', 'undocumented', 'visa_holder'
    country_of_origin VARCHAR(3) NOT NULL, -- ISO country code
    arrival_date DATE,
    primary_spoken_language VARCHAR(10) NOT NULL, -- ISO language code
    primary_sign_language VARCHAR(10), -- Sign language code
    cultural_background TEXT,
    religious_considerations TEXT,
    family_reunification_status VARCHAR(20) DEFAULT 'complete', -- 'complete', 'pending', 'separated'
    sponsorship_status VARCHAR(20), -- 'sponsored', 'self_sponsored', 'refugee_resettlement'
    documentation_status VARCHAR(20) DEFAULT 'complete', -- 'complete', 'partial', 'pending', 'lost'
    language_barriers TEXT, -- JSON array
    cultural_barriers TEXT, -- JSON array
    trauma_history BOOLEAN DEFAULT FALSE,
    special_needs TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Immigrant Benefit Opportunities
CREATE TABLE immigrant_benefit_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    benefit_name VARCHAR(255) NOT NULL,
    benefit_type VARCHAR(30) NOT NULL, -- 'healthcare', 'education', 'financial_assistance', 'legal_support', etc.
    eligibility_by_status TEXT NOT NULL, -- JSON object mapping status to eligibility
    language_support TEXT, -- JSON array of supported languages
    cultural_considerations TEXT, -- JSON array
    documentation_required TEXT, -- JSON array
    waiting_periods TEXT, -- JSON object mapping status to waiting period in years
    potential_value DECIMAL(10,2) DEFAULT 0,
    application_complexity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'very_high'
    interpreter_required BOOLEAN DEFAULT FALSE,
    cultural_liaison_recommended BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'discovered', -- 'discovered', 'eligible', 'applied', 'approved', 'denied'
    application_url TEXT,
    contact_information TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(family_id, benefit_name)
);

-- Interpreter Service Requests
CREATE TABLE interpreter_service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'medical', 'legal', 'government', 'education', 'emergency'
    required_languages TEXT NOT NULL, -- JSON array of language codes
    appointment_date TIMESTAMP,
    duration_hours INTEGER DEFAULT 2,
    location_type VARCHAR(20) DEFAULT 'in_person', -- 'in_person', 'video', 'phone'
    location_address TEXT,
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'requested', -- 'requested', 'matched', 'confirmed', 'completed', 'cancelled'
    interpreter_id UUID,
    cost_covered_by VARCHAR(50), -- 'government', 'insurance', 'nonprofit', 'self_pay'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Document Translations
CREATE TABLE document_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'birth_certificate', 'marriage_certificate', 'diploma', 'medical_records', etc.
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    original_document_url TEXT NOT NULL,
    translated_document_url TEXT,
    certified_translation BOOLEAN DEFAULT FALSE,
    translator_id UUID,
    translation_agency VARCHAR(255),
    status VARCHAR(20) DEFAULT 'requested', -- 'requested', 'in_progress', 'completed', 'certified', 'rejected'
    cost DECIMAL(8,2),
    cost_covered_by VARCHAR(50),
    completion_date DATE,
    certification_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cultural Navigation Plans
CREATE TABLE cultural_navigation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    cultural_transitions TEXT, -- JSON array of transition areas
    language_support_plan TEXT, -- JSON object
    community_integration_plan TEXT, -- JSON object
    service_navigation_plan TEXT, -- JSON object
    timeline_recommendations TEXT, -- JSON array
    resource_connections TEXT, -- JSON array
    mentor_assigned BOOLEAN DEFAULT FALSE,
    mentor_id UUID,
    cultural_liaison_assigned BOOLEAN DEFAULT FALSE,
    cultural_liaison_id UUID,
    plan_status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'on_hold', 'cancelled'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Language Support Services
CREATE TABLE language_support_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    service_type VARCHAR(30) NOT NULL, -- 'esl_classes', 'asl_classes', 'interpretation', 'translation'
    language_code VARCHAR(10) NOT NULL,
    sign_language_code VARCHAR(10),
    provider_organization VARCHAR(255),
    provider_contact TEXT, -- JSON
    service_schedule TEXT, -- JSON
    enrollment_status VARCHAR(20) DEFAULT 'available', -- 'available', 'enrolled', 'waitlisted', 'completed', 'dropped'
    enrollment_date DATE,
    completion_date DATE,
    cost DECIMAL(8,2) DEFAULT 0,
    cost_covered_by VARCHAR(50),
    progress_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cultural Competency Assessments
CREATE TABLE cultural_competency_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    assessment_type VARCHAR(30) NOT NULL, -- 'initial', 'progress', 'completion'
    cultural_knowledge_score INTEGER, -- 1-100
    language_proficiency_score INTEGER, -- 1-100
    community_integration_score INTEGER, -- 1-100
    service_navigation_score INTEGER, -- 1-100
    overall_adaptation_score INTEGER, -- 1-100
    areas_of_strength TEXT, -- JSON array
    areas_for_improvement TEXT, -- JSON array
    recommended_services TEXT, -- JSON array
    assessor_id UUID,
    assessment_date DATE NOT NULL,
    next_assessment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Contact Networks
CREATE TABLE emergency_contact_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    contact_type VARCHAR(30) NOT NULL, -- 'family_overseas', 'local_sponsor', 'cultural_liaison', 'interpreter', 'legal_aid'
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    country_code VARCHAR(3),
    languages_spoken TEXT, -- JSON array
    sign_languages TEXT, -- JSON array
    available_hours VARCHAR(100),
    emergency_only BOOLEAN DEFAULT FALSE,
    cultural_background VARCHAR(100),
    special_skills TEXT, -- JSON array
    priority_order INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT FALSE,
    last_contact_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Immigration Status Tracking
CREATE TABLE immigration_status_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    current_status VARCHAR(30) NOT NULL,
    status_expiry_date DATE,
    renewal_reminder_date DATE,
    application_in_progress VARCHAR(50), -- Type of application pending
    application_reference VARCHAR(100),
    application_date DATE,
    expected_decision_date DATE,
    legal_representation BOOLEAN DEFAULT FALSE,
    attorney_contact TEXT, -- JSON
    case_notes TEXT,
    document_checklist TEXT, -- JSON array
    next_action_required VARCHAR(255),
    next_action_due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_immigrant_family_profiles_family_id ON immigrant_family_profiles(family_id);
CREATE INDEX idx_immigrant_family_profiles_immigration_status ON immigrant_family_profiles(immigration_status);
CREATE INDEX idx_immigrant_family_profiles_country_of_origin ON immigrant_family_profiles(country_of_origin);
CREATE INDEX idx_immigrant_benefit_opportunities_family_id ON immigrant_benefit_opportunities(family_id);
CREATE INDEX idx_immigrant_benefit_opportunities_status ON immigrant_benefit_opportunities(status);
CREATE INDEX idx_interpreter_service_requests_family_id ON interpreter_service_requests(family_id);
CREATE INDEX idx_interpreter_service_requests_status ON interpreter_service_requests(status);
CREATE INDEX idx_document_translations_family_id ON document_translations(family_id);
CREATE INDEX idx_document_translations_status ON document_translations(status);
CREATE INDEX idx_cultural_navigation_plans_family_id ON cultural_navigation_plans(family_id);
CREATE INDEX idx_language_support_services_family_id ON language_support_services(family_id);
CREATE INDEX idx_emergency_contact_networks_family_id ON emergency_contact_networks(family_id);
CREATE INDEX idx_immigration_status_tracking_family_id ON immigration_status_tracking(family_id);
