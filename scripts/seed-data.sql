-- Seed data for VisualDesk

-- Insert default form templates
INSERT INTO form_templates (id, name, category, provider, fields, validation_rules, ai_processing_config) VALUES
(
    gen_random_uuid(),
    'Health Insurance Claim',
    'healthcare',
    'BlueCross BlueShield',
    '[
        {"id": "patient_name", "name": "patient_name", "type": "text", "label": "Patient Name", "required": true},
        {"id": "policy_number", "name": "policy_number", "type": "text", "label": "Policy Number", "required": true},
        {"id": "service_date", "name": "service_date", "type": "date", "label": "Date of Service", "required": true},
        {"id": "provider_name", "name": "provider_name", "type": "text", "label": "Healthcare Provider", "required": true},
        {"id": "diagnosis", "name": "diagnosis", "type": "text", "label": "Diagnosis", "required": false},
        {"id": "claim_amount", "name": "claim_amount", "type": "number", "label": "Claim Amount", "required": true}
    ]'::jsonb,
    '{
        "patient_name": {"min_length": 2, "max_length": 100},
        "policy_number": {"pattern": "^[A-Z0-9]{8,12}$"},
        "claim_amount": {"min": 0, "max": 50000}
    }'::jsonb,
    '{
        "extraction_hints": ["Look for patient information", "Extract policy numbers", "Identify service dates"],
        "validation_rules": ["Verify policy number format", "Check date validity"],
        "processing_time_estimate": 24
    }'::jsonb
),
(
    gen_random_uuid(),
    'Mortgage Application',
    'financial',
    'First National Bank',
    '[
        {"id": "applicant_name", "name": "applicant_name", "type": "text", "label": "Applicant Name", "required": true},
        {"id": "ssn", "name": "ssn", "type": "text", "label": "Social Security Number", "required": true},
        {"id": "annual_income", "name": "annual_income", "type": "number", "label": "Annual Income", "required": true},
        {"id": "loan_amount", "name": "loan_amount", "type": "number", "label": "Requested Loan Amount", "required": true},
        {"id": "property_address", "name": "property_address", "type": "text", "label": "Property Address", "required": true},
        {"id": "employment_status", "name": "employment_status", "type": "select", "label": "Employment Status", "required": true}
    ]'::jsonb,
    '{
        "applicant_name": {"min_length": 2, "max_length": 100},
        "ssn": {"pattern": "^\\d{3}-\\d{2}-\\d{4}$"},
        "annual_income": {"min": 0, "max": 10000000},
        "loan_amount": {"min": 50000, "max": 5000000}
    }'::jsonb,
    '{
        "extraction_hints": ["Extract personal information", "Find income details", "Identify property information"],
        "validation_rules": ["Verify SSN format", "Check income documentation"],
        "processing_time_estimate": 72
    }'::jsonb
);

-- Insert default avatar interpreters
INSERT INTO interpreters (
    id, name, type, specializations, status, avatar_config, ai_model_version, capabilities, rating, total_sessions
) VALUES
(
    gen_random_uuid(),
    'Maya',
    'avatar',
    '["Healthcare", "Medical", "Insurance"]'::jsonb,
    'available',
    '{
        "style": "professional",
        "voice_id": "maya_voice_v1",
        "appearance_settings": {
            "hair": "brown",
            "skin": "medium",
            "clothing": "professional_scrubs",
            "accessories": ["stethoscope"]
        },
        "gesture_library": ["medical_explanation", "empathetic_listening", "form_guidance"],
        "expression_library": ["neutral", "empathetic", "informative", "reassuring"]
    }'::jsonb,
    'v1.2',
    '["form_assistance", "medical_interpretation", "insurance_guidance", "patient_advocacy"]'::jsonb,
    4.8,
    0
),
(
    gen_random_uuid(),
    'Alex',
    'avatar',
    '["Financial", "Banking", "Mortgage", "Insurance"]'::jsonb,
    'available',
    '{
        "style": "business",
        "voice_id": "alex_voice_v1",
        "appearance_settings": {
            "hair": "black",
            "skin": "light",
            "clothing": "business_suit",
            "accessories": ["glasses"]
        },
        "gesture_library": ["financial_explanation", "document_review", "calculation_demonstration"],
        "expression_library": ["neutral", "confident", "analytical", "trustworthy"]
    }'::jsonb,
    'v1.2',
    '["financial_planning", "loan_assistance", "investment_guidance", "tax_preparation"]'::jsonb,
    4.9,
    0
),
(
    gen_random_uuid(),
    'Taylor',
    'avatar',
    '["General", "Customer Service", "Government Forms"]'::jsonb,
    'available',
    '{
        "style": "friendly",
        "voice_id": "taylor_voice_v1",
        "appearance_settings": {
            "hair": "blonde",
            "skin": "medium",
            "clothing": "casual_professional",
            "accessories": []
        },
        "gesture_library": ["general_explanation", "step_by_step_guidance", "encouragement"],
        "expression_library": ["neutral", "friendly", "helpful", "patient"]
    }'::jsonb,
    'v1.2',
    '["general_assistance", "form_completion", "customer_service", "basic_interpretation"]'::jsonb,
    4.7,
    0
);

-- Insert sample human interpreters
INSERT INTO interpreters (
    id, name, type, specializations, status, certifications, languages, availability_schedule, hourly_rate, bio, rating, total_sessions
) VALUES
(
    gen_random_uuid(),
    'Sarah Johnson',
    'human',
    '["Legal", "Government", "Court Proceedings"]'::jsonb,
    'available',
    '["Certified Legal Interpreter", "Government Security Clearance", "Court Interpreter Certification"]'::jsonb,
    '["English", "ASL", "Spanish"]'::jsonb,
    '{
        "timezone": "America/New_York",
        "weekdays": [{"start": "09:00", "end": "17:00"}],
        "weekends": []
    }'::jsonb,
    85.00,
    'Certified legal interpreter with over 10 years of experience in court proceedings and government documentation. Specializes in complex legal terminology and deaf advocacy.',
    4.9,
    247
),
(
    gen_random_uuid(),
    'Michael Chen',
    'human',
    '["Medical", "Technical", "Scientific"]'::jsonb,
    'available',
    '["Medical Interpreter Certification", "Technical Specialist", "Healthcare Privacy Certification"]'::jsonb,
    '["English", "ASL", "Mandarin"]'::jsonb,
    '{
        "timezone": "America/Los_Angeles",
        "weekdays": [{"start": "10:00", "end": "18:00"}],
        "weekends": [{"start": "12:00", "end": "16:00"}]
    }'::jsonb,
    95.00,
    'Medical interpreter with expertise in complex medical procedures and technical documentation. Fluent in medical terminology and patient advocacy.',
    4.8,
    189
);
