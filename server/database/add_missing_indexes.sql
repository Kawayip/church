-- Add only missing performance indexes to improve query speed

-- Events table indexes (these are likely missing)
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_event_date (event_date);
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_event_type (event_type);
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_is_featured (is_featured);
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_event_date_type (event_date, event_type);
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_featured_date (is_featured, event_date);

-- Posts table indexes (some may already exist)
ALTER TABLE posts ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE posts ADD INDEX IF NOT EXISTS idx_updated_at (updated_at);
ALTER TABLE posts ADD INDEX IF NOT EXISTS idx_featured_created (is_featured, created_at);

-- Users table indexes
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_role (role);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_is_active (is_active);

-- Resources table indexes (basic ones that should exist)
ALTER TABLE resources ADD INDEX IF NOT EXISTS idx_created_at (created_at);

-- Ministries table indexes (status column exists, is_active doesn't)
ALTER TABLE ministries ADD INDEX IF NOT EXISTS idx_status (status);

-- Contact messages indexes
ALTER TABLE contact_messages ADD INDEX IF NOT EXISTS idx_is_read (is_read);
ALTER TABLE contact_messages ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE contact_messages ADD INDEX IF NOT EXISTS idx_read_created (is_read, created_at);
