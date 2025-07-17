-- Emergency Calls Table
CREATE TABLE emergency_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('text', 'video', 'photo', 'voice-to-text')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('connecting', 'active', 'completed', 'failed')),
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_address TEXT,
    location_landmarks TEXT[],
    dispatcher_id VARCHAR(100),
    interpreter_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    response_time_minutes INTEGER
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    asl_capable BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    notification_preference VARCHAR(10) CHECK (notification_preference IN ('text', 'call', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Profiles Table
CREATE TABLE medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    conditions TEXT[],
    medications TEXT[],
    allergies TEXT[],
    blood_type VARCHAR(5),
    emergency_physician VARCHAR(255),
    preferred_hospital VARCHAR(255),
    insurance_info TEXT,
    special_needs TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Alerts Table
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('weather', 'amber', 'emergency', 'community', 'medical')),
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    location_area VARCHAR(255),
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_radius INTEGER, -- in meters
    visual_alerts JSONB,
    asl_video_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Emergency Evidence Table
CREATE TABLE emergency_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES emergency_calls(id),
    evidence_type VARCHAR(10) CHECK (evidence_type IN ('photo', 'video', 'audio')),
    file_url VARCHAR(500) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Response Analytics Table
CREATE TABLE emergency_response_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_area VARCHAR(255),
    response_time_avg DECIMAL(5, 2), -- in minutes
    accessibility_rating DECIMAL(3, 2), -- 1-5 scale
    total_calls INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    month_year DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert Subscriptions Table
CREATE TABLE alert_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    alert_types TEXT[],
    location_areas TEXT[],
    push_subscription JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_emergency_calls_user_id ON emergency_calls(user_id);
CREATE INDEX idx_emergency_calls_status ON emergency_calls(status);
CREATE INDEX idx_emergency_calls_created_at ON emergency_calls(created_at);
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(priority);
CREATE INDEX idx_emergency_alerts_active ON emergency_alerts(is_active);
CREATE INDEX idx_emergency_alerts_location ON emergency_alerts(location_area);
CREATE INDEX idx_emergency_alerts_severity ON emergency_alerts(severity);
CREATE INDEX idx_emergency_evidence_call_id ON emergency_evidence(call_id);
