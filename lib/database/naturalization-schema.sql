-- Naturalization Tracking Database Schema

-- Naturalization Applications
CREATE TABLE naturalization_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    application_number VARCHAR(50), -- USCIS receipt number
    current_status VARCHAR(30) NOT NULL DEFAULT 'eligibility_review',
    eligibility_date DATE NOT NULL,
    application_submission_date DATE,
    expected_completion_date DATE,
    priority_processing BOOLEAN DEFAULT FALSE,
    accommodations_requested TEXT, -- JSON array
    accommodations_approved TEXT, -- JSON array
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 12,
    filing_fee_paid BOOLEAN DEFAULT FALSE,
    biometrics_fee_paid BOOLEAN DEFAULT FALSE,
    total_fees_paid DECIMAL(8,2) DEFAULT 0,
    attorney_representation BOOLEAN DEFAULT FALSE,
    attorney_contact TEXT, -- JSON
    special_circumstances TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deaf-Specific Accommodations
CREATE TABLE deaf_accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    accommodation_type VARCHAR(50) NOT NULL,
    specific_requests TEXT NOT NULL, -- JSON array
    justification TEXT NOT NULL,
    medical_documentation TEXT, -- URL to uploaded documentation
    request_status VARCHAR(20) DEFAULT 'pending',
    approval_date DATE,
    denial_reason TEXT,
    implementation_notes TEXT,
    uscis_reference VARCHAR(100), -- USCIS accommodation reference number
    interpreter_assigned VARCHAR(255),
    interpreter_contact TEXT, -- JSON
    accommodation_cost DECIMAL(8,2) DEFAULT 0,
    cost_covered_by VARCHAR(50), -- 'uscis', 'applicant', 'nonprofit'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Naturalization Milestones
CREATE TABLE naturalization_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    milestone_type VARCHAR(50) NOT NULL,
    milestone_title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'in_progress', 'completed', 'overdue', 'cancelled'
    accommodations_needed BOOLEAN DEFAULT FALSE,
    accommodation_details TEXT,
    documents TEXT, -- JSON array of required documents
    next_steps TEXT, -- JSON array
    priority VARCHAR(10) DEFAULT 'medium',
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Civics Test Preparation
CREATE TABLE civics_test_preparation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    test_format VARCHAR(30) DEFAULT 'deaf_accommodated',
    study_materials TEXT, -- JSON array
    practice_test_scores TEXT, -- JSON array of test results
    weak_areas TEXT, -- JSON array
    strength_areas TEXT, -- JSON array
    recommended_study_plan TEXT, -- JSON array
    interpreter_needed BOOLEAN DEFAULT TRUE,
    visual_aids_needed BOOLEAN DEFAULT TRUE,
    extended_time_needed BOOLEAN DEFAULT TRUE,
    readiness_score INTEGER DEFAULT 0, -- 0-100
    estimated_test_date DATE,
    actual_test_date DATE,
    test_score INTEGER,
    test_passed BOOLEAN,
    retake_needed BOOLEAN DEFAULT FALSE,
    study_hours_logged INTEGER DEFAULT 0,
    tutor_assigned VARCHAR(255),
    study_group_participation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- English Test Preparation
CREATE TABLE english_test_preparation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    reading_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    writing_level VARCHAR(20),
    speaking_level VARCHAR(20),
    listening_level VARCHAR(20),
    accommodations_needed TEXT, -- JSON array
    alternative_testing_format BOOLEAN DEFAULT FALSE,
    practice_scores TEXT, -- JSON array
    improvement_areas TEXT, -- JSON array
    study_plan TEXT, -- JSON array
    esl_classes_enrolled BOOLEAN DEFAULT FALSE,
    esl_class_provider VARCHAR(255),
    tutor_assigned VARCHAR(255),
    readiness_assessment INTEGER DEFAULT 0, -- 0-100
    test_waiver_eligible BOOLEAN DEFAULT FALSE,
    waiver_reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Interview Preparation
CREATE TABLE interview_preparation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    interview_date DATE,
    interview_location VARCHAR(255),
    interview_officer VARCHAR(255),
    accommodations_confirmed TEXT, -- JSON array
    practice_sessions_completed INTEGER DEFAULT 0,
    mock_interview_scores TEXT, -- JSON array
    potential_challenges TEXT, -- JSON array
    preparation_strategies TEXT, -- JSON array
    interpreter_assigned VARCHAR(255),
    interpreter_contact TEXT, -- JSON
    cultural_considerations TEXT, -- JSON array
    readiness_level VARCHAR(20) DEFAULT 'not_ready',
    confidence_score INTEGER DEFAULT 0, -- 0-100
    application_review_completed BOOLEAN DEFAULT FALSE,
    documents_organized BOOLEAN DEFAULT FALSE,
    transportation_arranged BOOLEAN DEFAULT FALSE,
    support_person_attending BOOLEAN DEFAULT FALSE,
    support_person_details TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Family Naturalization Coordination
CREATE TABLE family_naturalization_coordination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES family_units(id) ON DELETE CASCADE,
    coordinated_applications TEXT NOT NULL, -- JSON array of application IDs
    family_strategy VARCHAR(20) DEFAULT 'simultaneous', -- 'simultaneous', 'sequential', 'independent'
    primary_applicant UUID REFERENCES family_members(id),
    dependent_applications TEXT, -- JSON array
    shared_accommodations TEXT, -- JSON array
    family_interview_date DATE,
    ceremony_celebration_planned BOOLEAN DEFAULT FALSE,
    celebration_details TEXT, -- JSON
    total_family_cost DECIMAL(10,2) DEFAULT 0,
    cost_sharing_plan TEXT, -- JSON object
    timeline_coordination TEXT, -- JSON object
    family_attorney VARCHAR(255),
    coordination_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Naturalization Status Log
CREATE TABLE naturalization_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    status_date TIMESTAMP DEFAULT NOW(),
    changed_by VARCHAR(255),
    change_reason TEXT,
    notes TEXT,
    uscis_notification BOOLEAN DEFAULT FALSE,
    notification_method VARCHAR(50), -- 'mail', 'email', 'text', 'online'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Document Checklist
CREATE TABLE naturalization_document_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    submitted BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    document_url TEXT,
    translation_needed BOOLEAN DEFAULT FALSE,
    translation_completed BOOLEAN DEFAULT FALSE,
    translation_url TEXT,
    certification_needed BOOLEAN DEFAULT FALSE,
    certification_completed BOOLEAN DEFAULT FALSE,
    expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Oath Ceremony Tracking
CREATE TABLE oath_ceremony_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES naturalization_applications(id) ON DELETE CASCADE,
    ceremony_date DATE,
    ceremony_location VARCHAR(255),
    ceremony_time TIME,
    accommodations_requested TEXT, -- JSON array
    accommodations_confirmed TEXT, -- JSON array
    interpreter_assigned VARCHAR(255),
    family_guests_allowed INTEGER DEFAULT 0,
    guest_list TEXT, -- JSON array
    certificate_received BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(50),
    celebration_planned BOOLEAN DEFAULT FALSE,
    celebration_details TEXT, -- JSON
    photos_allowed BOOLEAN DEFAULT TRUE,
    special_instructions TEXT,
    attendance_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_naturalization_applications_family_id ON naturalization_applications(family_id);
CREATE INDEX idx_naturalization_applications_applicant_id ON naturalization_applications(applicant_id);
CREATE INDEX idx_naturalization_applications_status ON naturalization_applications(current_status);
CREATE INDEX idx_naturalization_applications_eligibility_date ON naturalization_applications(eligibility_date);
CREATE INDEX idx_deaf_accommodations_application_id ON deaf_accommodations(application_id);
CREATE INDEX idx_deaf_accommodations_status ON deaf_accommodations(request_status);
CREATE INDEX idx_naturalization_milestones_application_id ON naturalization_milestones(application_id);
CREATE INDEX idx_naturalization_milestones_status ON naturalization_milestones(status);
CREATE INDEX idx_civics_test_preparation_applicant_id ON civics_test_preparation(applicant_id);
CREATE INDEX idx_interview_preparation_application_id ON interview_preparation(application_id);
CREATE INDEX idx_family_naturalization_coordination_family_id ON family_naturalization_coordination(family_id);
CREATE INDEX idx_naturalization_status_log_application_id ON naturalization_status_log(application_id);
CREATE INDEX idx_document_checklist_application_id ON naturalization_document_checklist(application_id);
CREATE INDEX idx_oath_ceremony_tracking_application_id ON oath_ceremony_tracking(application_id);
