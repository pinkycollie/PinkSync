-- Create sign language content table
CREATE TABLE IF NOT EXISTS sign_language_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    qr_code_data VARCHAR(500) UNIQUE NOT NULL,
    video_url TEXT,
    model_3d_url TEXT,
    ar_preview_url TEXT,
    languages TEXT[] DEFAULT ARRAY['ASL'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create QR code tracking table
CREATE TABLE IF NOT EXISTS qr_code_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES sign_language_content(id),
    qr_code_data VARCHAR(500) NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    location_data JSONB,
    session_id VARCHAR(255)
);

-- Create sign language processing jobs table
CREATE TABLE IF NOT EXISTS sign_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES sign_language_content(id),
    job_type VARCHAR(50) NOT NULL, -- 'generate_video', 'generate_3d', 'process_ar'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    input_data JSONB NOT NULL,
    output_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Insert sample data
INSERT INTO sign_language_content (title, description, category, qr_code_data, languages) VALUES
('Welcome Message', 'A friendly welcome message in American Sign Language (ASL)', 'Greetings', 'sign-language-content-1', ARRAY['ASL', 'BSL']),
('Emergency Information', 'Critical emergency evacuation instructions in sign language', 'Safety', 'sign-language-content-2', ARRAY['ASL']),
('Restaurant Menu Guide', 'A guide to common restaurant menu items and useful phrases', 'Food & Dining', 'sign-language-content-3', ARRAY['ASL', 'International Sign']),
('Public Transportation', 'Guide to navigating public transportation systems', 'Travel', 'sign-language-content-4', ARRAY['ASL']),
('Medical Appointment', 'Essential sign language phrases for medical appointments', 'Healthcare', 'sign-language-content-5', ARRAY['ASL', 'BSL']),
('Job Interview Tips', 'Sign language content for job interviews and workplace communication', 'Career', 'sign-language-content-6', ARRAY['ASL']);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sign_content_qr_code ON sign_language_content(qr_code_data);
CREATE INDEX IF NOT EXISTS idx_sign_content_category ON sign_language_content(category);
CREATE INDEX IF NOT EXISTS idx_sign_content_active ON sign_language_content(is_active);
CREATE INDEX IF NOT EXISTS idx_qr_scans_content_id ON qr_code_scans(content_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_date ON qr_code_scans(scanned_at);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON sign_processing_jobs(status);
