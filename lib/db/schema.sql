-- Create a table for PinkSync documentation sections
CREATE TABLE IF NOT EXISTS pinksync_documentation (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  section VARCHAR(50) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for demo scenarios
CREATE TABLE IF NOT EXISTS pinksync_demos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add permissions for PinkSync documentation
INSERT INTO permissions (name, description, resource, action)
VALUES 
('pinksync:read', 'Can view PinkSync documentation', 'pinksync', 'read'),
('pinksync:demo', 'Can access PinkSync interactive demos', 'pinksync', 'demo'),
('pinksync:edit', 'Can edit PinkSync documentation', 'pinksync', 'edit')
ON CONFLICT (resource, action) DO NOTHING;

-- Create a special role for shareholders and officials
INSERT INTO roles (name, description)
VALUES ('stakeholder', 'Shareholders, officials and key stakeholders')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to stakeholder role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'stakeholder' AND p.name IN (
  'pinksync:read', 'pinksync:demo'
)
ON CONFLICT DO NOTHING;

-- Also give admin role these permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name IN (
  'pinksync:read', 'pinksync:demo', 'pinksync:edit'
)
ON CONFLICT DO NOTHING;
