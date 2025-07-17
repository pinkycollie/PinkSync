-- FCC Telecommunications Data
CREATE TABLE fcc_telecommunications_data (
  id VARCHAR(255) PRIMARY KEY,
  report_date TIMESTAMP NOT NULL,
  accessible_phone_programs JSONB NOT NULL,
  video_relay_services JSONB NOT NULL,
  accessibility_compliance JSONB NOT NULL,
  emergency_services JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax Credit Data
CREATE TABLE tax_credit_data (
  id VARCHAR(255) PRIMARY KEY,
  jurisdiction VARCHAR(255) NOT NULL,
  jurisdiction_type VARCHAR(50) NOT NULL CHECK (jurisdiction_type IN ('federal', 'state', 'city', 'county')),
  credit_type VARCHAR(100) NOT NULL,
  credit_name VARCHAR(255) NOT NULL,
  credit_amount DECIMAL(12,2) NOT NULL,
  eligibility_requirements JSONB NOT NULL,
  utilization_rate DECIMAL(5,2) NOT NULL,
  total_claimed_amount DECIMAL(15,2) NOT NULL,
  beneficiary_count INTEGER NOT NULL,
  deaf_employee_count INTEGER NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  expiration_date TIMESTAMP,
  renewal_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Company Benefit Data
CREATE TABLE company_benefit_data (
  company_id VARCHAR(255) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  company_size VARCHAR(50) NOT NULL,
  location JSONB NOT NULL,
  deaf_employment_data JSONB NOT NULL,
  benefits_received JSONB NOT NULL,
  community_contributions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Community Impact Metrics
CREATE TABLE community_impact_metrics (
  id SERIAL PRIMARY KEY,
  jurisdiction VARCHAR(255) NOT NULL,
  timeframe VARCHAR(50) NOT NULL,
  economic_impact JSONB NOT NULL,
  accessibility_improvements JSONB NOT NULL,
  social_impact JSONB NOT NULL,
  innovation_contributions JSONB NOT NULL,
  ai_insights TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transparency Reports
CREATE TABLE transparency_reports (
  id SERIAL PRIMARY KEY,
  jurisdiction VARCHAR(255) NOT NULL,
  timeframe VARCHAR(50) NOT NULL,
  report_data JSONB NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  public_url VARCHAR(500),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Real-time Data Sources
CREATE TABLE data_source_status (
  source_name VARCHAR(255) PRIMARY KEY,
  last_sync_at TIMESTAMP,
  sync_status VARCHAR(50) NOT NULL,
  error_message TEXT,
  next_sync_at TIMESTAMP,
  sync_frequency_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fcc_data_report_date ON fcc_telecommunications_data(report_date);
CREATE INDEX idx_tax_credit_jurisdiction ON tax_credit_data(jurisdiction, jurisdiction_type);
CREATE INDEX idx_company_benefit_industry ON company_benefit_data(industry);
CREATE INDEX idx_community_impact_jurisdiction_timeframe ON community_impact_metrics(jurisdiction, timeframe);
CREATE INDEX idx_transparency_reports_jurisdiction ON transparency_reports(jurisdiction);
