-- Create database if not exists
CREATE DATABASE IF NOT EXISTS larachurch;
USE larachurch;

-- Users table for member portal and admin access
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'member', 'guest') DEFAULT 'member',
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    baptism_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table for church announcements and content
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    category VARCHAR(100) DEFAULT 'General',
    tags JSON,
    featured_image_data LONGBLOB,
    featured_image_type VARCHAR(100),
    featured_image_name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    INDEX idx_is_featured (is_featured)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    end_time TIME,
    location VARCHAR(200),
    event_type ENUM('service', 'meeting', 'outreach', 'youth', 'special') DEFAULT 'service',
    is_featured BOOLEAN DEFAULT FALSE,
    image_data LONGBLOB,
    image_type VARCHAR(100),
    image_name VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Sermons table
CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    preacher VARCHAR(100) NOT NULL,
    sermon_date DATE NOT NULL,
    scripture_reference VARCHAR(200),
    description TEXT,
    video_data LONGBLOB,
    video_type VARCHAR(100),
    video_name VARCHAR(255),
    audio_data LONGBLOB,
    audio_type VARCHAR(100),
    audio_name VARCHAR(255),
    notes_data LONGBLOB,
    notes_type VARCHAR(100),
    notes_name VARCHAR(255),
    duration_minutes INT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ministries table
CREATE TABLE IF NOT EXISTS ministries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_description LONGTEXT,
    featured_image_data LONGBLOB,
    featured_image_type VARCHAR(100),
    featured_image_name VARCHAR(255),
    leader_name VARCHAR(255),
    leader_email VARCHAR(255),
    leader_phone VARCHAR(50),
    meeting_time VARCHAR(255),
    meeting_location VARCHAR(255),
    contact_info TEXT,
    requirements TEXT,
    age_group VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Gallery collections table
CREATE TABLE IF NOT EXISTS gallery_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('events', 'services', 'outreach', 'youth', 'general') DEFAULT 'general',
    thumbnail_image_id INT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT,
    title VARCHAR(200),
    description TEXT,
    image_data LONGBLOB NOT NULL,
    image_type VARCHAR(100) NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES gallery_collections(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Legacy gallery table (for backward compatibility)
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_data LONGBLOB NOT NULL,
    image_type VARCHAR(100) NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    category ENUM('events', 'services', 'outreach', 'youth', 'general') DEFAULT 'general',
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_data LONGBLOB NOT NULL,
    file_type ENUM('pdf', 'doc', 'video', 'audio', 'image') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    category ENUM('study', 'music', 'announcement', 'form', 'other') DEFAULT 'other',
    is_public BOOLEAN DEFAULT TRUE,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    purpose VARCHAR(200),
    payment_method ENUM('online', 'cash', 'check') DEFAULT 'online',
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sabbath School materials table
CREATE TABLE IF NOT EXISTS sabbath_school (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    lesson_number INT,
    quarter VARCHAR(50),
    year INT,
    content TEXT,
    pdf_data LONGBLOB,
    pdf_type VARCHAR(100),
    pdf_name VARCHAR(255),
    video_data LONGBLOB,
    video_type VARCHAR(100),
    video_name VARCHAR(255),
    discussion_questions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES 
('admin', 'admin@mtolives.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, event_type, is_featured) VALUES 
('New Year Revival', 'Special New Year revival service with powerful preaching and worship', '2024-01-04', '18:00:00', 'Main Sanctuary', 'special', TRUE),
('Youth Sabbath', 'Youth-led Sabbath service with contemporary worship', '2024-01-11', '11:00:00', 'Main Sanctuary', 'youth', TRUE),
('Health Fair', 'Community health fair with free health screenings', '2024-01-18', '10:00:00', 'Church Grounds', 'outreach', TRUE);

-- Insert sample ministries
INSERT INTO ministries (name, slug, description, long_description, leader_name, leader_email, leader_phone, meeting_time, meeting_location, contact_info, requirements, age_group, status) VALUES 
('Youth Ministry', 'youth-ministry', 'Dynamic youth program for ages 13-30', 'Our Youth Ministry is dedicated to empowering young people to grow in their faith while building meaningful relationships. We provide a safe space for youth to explore their spirituality, develop leadership skills, and connect with peers who share similar values. Through weekly meetings, special events, and community service projects, we help young people discover their purpose and potential in Christ.', 'John Doe', 'youth@mtolives.org', '+256 701 234 567', 'Every Sabbath 2:00 PM', 'Youth Hall', 'For more information, contact our youth leader or visit our youth office after services.', 'Open to all youth ages 13-30. No prior experience required.', '13-30 years', 'active'),
('Children\'s Ministry', 'childrens-ministry', 'Nurturing children in faith and character', 'The Children\'s Ministry focuses on creating a loving and engaging environment where children can learn about God\'s love through age-appropriate activities, stories, and songs. We believe in laying a strong spiritual foundation that will guide children throughout their lives. Our dedicated team of volunteers ensures that every child feels valued and included.', 'Jane Smith', 'children@mtolives.org', '+256 702 345 678', 'Every Sabbath 9:00 AM', 'Children\'s Room', 'Parents are welcome to join us or contact our children\'s ministry leader for more details.', 'All children welcome. Parents must sign a consent form for participation.', '3-12 years', 'active'),
('Music Ministry', 'music-ministry', 'Praising God through music and worship', 'The Music Ministry leads our congregation in worship through various musical expressions including choir, praise team, and instrumental ensembles. We believe that music is a powerful tool for connecting with God and creating an atmosphere of worship. Our ministry welcomes musicians of all skill levels and provides opportunities for growth and development.', 'David Wilson', 'music@mtolives.org', '+256 703 456 789', 'Wednesdays 7:00 PM', 'Main Sanctuary', 'Auditions are held quarterly. Contact our music director for more information.', 'Basic musical ability preferred. Commitment to regular rehearsals required.', 'All ages', 'active'),
('Health Ministry', 'health-ministry', 'Promoting health and wellness in the community', 'Our Health Ministry is committed to promoting physical, mental, and spiritual wellness in our church and community. We organize health fairs, wellness workshops, and provide resources for healthy living. We believe that caring for our bodies is part of honoring God and enables us to serve others effectively.', 'Dr. Sarah Johnson', 'health@mtolives.org', '+256 704 567 890', 'Monthly', 'Various Locations', 'Join our health ministry team or attend our monthly health seminars.', 'Medical background helpful but not required. Passion for health and wellness essential.', 'All ages', 'active');

-- Insert sample sermons
INSERT INTO sermons (title, preacher, sermon_date, scripture_reference, description, duration_minutes, is_featured) VALUES 
('Walking in Faith', 'Pastor Michael Brown', '2024-01-06', 'Hebrews 11:1-6', 'Understanding what it means to walk by faith', 45, TRUE),
('The Power of Prayer', 'Pastor Michael Brown', '2024-01-13', 'James 5:13-18', 'Discovering the transformative power of prayer', 50, TRUE),
('God\'s Love for You', 'Pastor Michael Brown', '2024-01-20', 'John 3:16-17', 'Understanding God\'s unconditional love', 48, TRUE); 