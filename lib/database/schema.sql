-- DeafLifeOS Database Schema

-- Core User Authentication and Profile Tables
CREATE TABLE deaf_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending_verification',
    verification_level VARCHAR(20) DEFAULT 'basic'
);

-- Deaf Identity Verification
CREATE TABLE deaf_identity_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    hearing_loss_type VARCHAR(50) NOT NULL, -- 'conductive', 'sensorineural', 'mixed', 'auditory_processing'
    hearing_loss_degree VARCHAR(30) NOT NULL, -- 'mild', 'moderate', 'severe', 'profound'
    hearing_loss_onset VARCHAR(20) NOT NULL, -- 'congenital', 'acquired'
    primary_communication VARCHAR(30) NOT NULL, -- 'ASL', 'PSE', 'oral', 'written', 'mixed'
    audiogram_file_url TEXT,
    medical_documentation_url TEXT,
    cochlear_implant BOOLEAN DEFAULT FALSE,
    hearing_aids BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_by UUID REFERENCES deaf_users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Multi-State Compliance and Intersectionality
CREATE TABLE user_state_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    state_code VARCHAR(2) NOT NULL,
    residence_status VARCHAR(20) NOT NULL, -- 'resident', 'temporary', 'student', 'worker'
    drivers_license_number VARCHAR(50),
    state_id_number VARCHAR(50),
    voter_registration_status BOOLEAN DEFAULT FALSE,
    disability_services_enrolled BOOLEAN DEFAULT FALSE,
    vr_services_enrolled BOOLEAN DEFAULT FALSE, -- Vocational Rehabilitation
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- International Travel and Identity
CREATE TABLE international_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    passport_number VARCHAR(50),
    passport_country VARCHAR(3), -- ISO country code
    passport_expiry DATE,
    global_entry BOOLEAN DEFAULT FALSE,
    tsa_precheck BOOLEAN DEFAULT FALSE,
    disability_travel_card TEXT, -- JSON for various country disability cards
    emergency_contacts TEXT, -- JSON array of international emergency contacts
    medical_travel_documents TEXT, -- JSON for medical device documentation
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Document AI and Analysis
CREATE TABLE document_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    ai_analysis_status VARCHAR(20) DEFAULT 'pending',
    ai_analysis_result TEXT, -- JSON with extracted data
    confidence_score DECIMAL(3,2),
    requires_human_review BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Business Optimization AI
CREATE TABLE business_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    optimization_type VARCHAR(50) NOT NULL, -- 'tax', 'benefits', 'compliance', 'workflow'
    current_state TEXT, -- JSON describing current situation
    recommendations TEXT, -- JSON with AI recommendations
    potential_savings DECIMAL(10,2),
    implementation_difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'
    priority_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    implemented_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Government Integration Tables
CREATE TABLE government_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    agency_type VARCHAR(50) NOT NULL, -- 'federal', 'state', 'local', 'school'
    agency_name VARCHAR(255) NOT NULL,
    connection_status VARCHAR(20) DEFAULT 'pending',
    api_credentials TEXT, -- Encrypted API keys/tokens
    last_sync TIMESTAMP,
    sync_frequency VARCHAR(20) DEFAULT 'daily',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Accessibility Preferences
CREATE TABLE accessibility_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    visual_alerts BOOLEAN DEFAULT TRUE,
    vibration_alerts BOOLEAN DEFAULT TRUE,
    high_contrast BOOLEAN DEFAULT FALSE,
    large_text BOOLEAN DEFAULT FALSE,
    asl_video_preferred BOOLEAN DEFAULT TRUE,
    interpreter_required BOOLEAN DEFAULT TRUE,
    cart_services_preferred BOOLEAN DEFAULT FALSE,
    emergency_contact_method VARCHAR(30) DEFAULT 'text',
    preferred_communication_language VARCHAR(10) DEFAULT 'ASL',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Security and Audit Logs
CREATE TABLE security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    details TEXT, -- JSON with additional context
    created_at TIMESTAMP DEFAULT NOW()
);

-- Community Verification Network
CREATE TABLE community_verifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verifier_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    verified_user_id UUID REFERENCES deaf_users(id) ON DELETE CASCADE,
    verification_type VARCHAR(30) NOT NULL, -- 'community', 'professional', 'institutional'
    relationship VARCHAR(50), -- 'friend', 'colleague', 'service_provider', 'family'
    verification_strength INTEGER DEFAULT 1, -- 1-5 scale
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(verifier_id, verified_user_id)
);

-- Indexes for performance
CREATE INDEX idx_deaf_users_email ON deaf_users(email);
CREATE INDEX idx_deaf_users_status ON deaf_users(status);
CREATE INDEX idx_document_analysis_user_id ON document_analysis(user_id);
CREATE INDEX idx_document_analysis_status ON document_analysis(ai_analysis_status);
CREATE INDEX idx_user_state_profiles_user_state ON user_state_profiles(user_id, state_code);
CREATE INDEX idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX idx_security_audit_log_created_at ON security_audit_log(created_at);
