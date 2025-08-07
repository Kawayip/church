-- Add performance indexes to improve query speed

-- Events table indexes
ALTER TABLE events ADD INDEX idx_event_date (event_date);
ALTER TABLE events ADD INDEX idx_event_type (event_type);
ALTER TABLE events ADD INDEX idx_is_featured (is_featured);
ALTER TABLE events ADD INDEX idx_created_at (created_at);
ALTER TABLE events ADD INDEX idx_event_date_type (event_date, event_type);
ALTER TABLE events ADD INDEX idx_featured_date (is_featured, event_date);

-- Posts table indexes (some already exist, but let's ensure they're optimized)
ALTER TABLE posts ADD INDEX idx_created_at (created_at);
ALTER TABLE posts ADD INDEX idx_updated_at (updated_at);
ALTER TABLE posts ADD INDEX idx_featured_created (is_featured, created_at);

-- Users table indexes
ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE users ADD INDEX idx_is_active (is_active);

-- Resources table indexes
ALTER TABLE resources ADD INDEX idx_category (category);
ALTER TABLE resources ADD INDEX idx_is_featured (is_featured);
ALTER TABLE resources ADD INDEX idx_created_at (created_at);
ALTER TABLE resources ADD INDEX idx_featured_category (is_featured, category);

-- Ministries table indexes
ALTER TABLE ministries ADD INDEX idx_status (status);
ALTER TABLE ministries ADD INDEX idx_is_active (is_active);

-- Contact messages indexes
ALTER TABLE contact_messages ADD INDEX idx_is_read (is_read);
ALTER TABLE contact_messages ADD INDEX idx_created_at (created_at);
ALTER TABLE contact_messages ADD INDEX idx_read_created (is_read, created_at);
