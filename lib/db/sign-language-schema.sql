-- Table for sign language generation requests
CREATE TABLE IF NOT EXISTS sign_language_requests (
  id SERIAL PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  text TEXT NOT NULL,
  target_dialect VARCHAR(10) NOT NULL,
  avatar_style VARCHAR(20) NOT NULL,
  quality VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration FLOAT,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sign_language_requests_request_id ON sign_language_requests(request_id);
CREATE INDEX IF NOT EXISTS idx_sign_language_requests_user_id ON sign_language_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sign_language_requests_status ON sign_language_requests(status);

-- Table for sign language glosses (dictionary)
CREATE TABLE IF NOT EXISTS sign_language_glosses (
  id SERIAL PRIMARY KEY,
  dialect VARCHAR(10) NOT NULL,
  gloss TEXT NOT NULL,
  meaning TEXT NOT NULL,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint for dialect + gloss
CREATE UNIQUE INDEX IF NOT EXISTS idx_sign_language_glosses_unique ON sign_language_glosses(dialect, gloss);

-- Table for caching common phrases
CREATE TABLE IF NOT EXISTS sign_language_cache (
  id SERIAL PRIMARY KEY,
  text_hash TEXT NOT NULL,
  text TEXT NOT NULL,
  dialect VARCHAR(10) NOT NULL,
  avatar_style VARCHAR(20) NOT NULL,
  quality VARCHAR(10) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 1
);

-- Index for faster cache lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_sign_language_cache_hash ON sign_language_cache(text_hash, dialect, avatar_style, quality);
