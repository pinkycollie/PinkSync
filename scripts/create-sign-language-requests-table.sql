CREATE TABLE IF NOT EXISTS sign_language_requests (
  id SERIAL PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  text TEXT NOT NULL,
  target_dialect VARCHAR(50) NOT NULL,
  avatar_style VARCHAR(50) NOT NULL,
  quality VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration NUMERIC,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
