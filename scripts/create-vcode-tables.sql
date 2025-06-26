-- Create additional tables for vCode integration

-- vCode sessions table
CREATE TABLE IF NOT EXISTS vcode_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'uploading', 'processing', 'transforming', 'verifying', 'completed', 'failed')),
    action VARCHAR(255) NOT NULL,
    context JSONB DEFAULT '{}',
    video_url TEXT,
    processed_data JSONB,
    trust_score DECIMAL(3,2),
    fibonrose_verification JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- vCode records table
CREATE TABLE IF NOT EXISTS vcode_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES vcode_sessions(id) ON DELETE CASCADE,
    vcode VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    video_signature VARCHAR(255) NOT NULL,
    extracted_data JSONB NOT NULL,
    trust_verification JSONB,
    status VARCHAR(20) DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'expired', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Update form_requests table to include vCode integration
ALTER TABLE form_requests ADD COLUMN IF NOT EXISTS vcode_session_id UUID REFERENCES vcode_sessions(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vcode_sessions_user_id ON vcode_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_vcode_sessions_status ON vcode_sessions(status);
CREATE INDEX IF NOT EXISTS idx_vcode_sessions_expires ON vcode_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_vcode_records_vcode ON vcode_records(vcode);
CREATE INDEX IF NOT EXISTS idx_vcode_records_user_id ON vcode_records(user_id);
CREATE INDEX IF NOT EXISTS idx_vcode_records_status ON vcode_records(status);
CREATE INDEX IF NOT EXISTS idx_form_requests_vcode_session ON form_requests(vcode_session_id);
