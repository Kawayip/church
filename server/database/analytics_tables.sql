-- Analytics Tables for Website Statistics
-- This file creates tables to track website usage, page views, sessions, and user engagement

USE larachurch;

-- Page views table to track individual page visits
CREATE TABLE IF NOT EXISTS page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(20),
    time_on_page INT DEFAULT 0, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_page_path (page_path),
    INDEX idx_created_at (created_at),
    INDEX idx_device_type (device_type)
);

-- Sessions table to track user sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(20),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    duration INT DEFAULT 0, -- in seconds
    page_count INT DEFAULT 1,
    is_bounce BOOLEAN DEFAULT TRUE,
    referrer VARCHAR(500),
    landing_page VARCHAR(500),
    exit_page VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_start_time (start_time),
    INDEX idx_device_type (device_type),
    INDEX idx_is_bounce (is_bounce)
);

-- Daily statistics table for aggregated data
CREATE TABLE IF NOT EXISTS daily_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_visitors INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    total_page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    new_visitors INT DEFAULT 0,
    returning_visitors INT DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration INT DEFAULT 0, -- in seconds
    avg_pages_per_session DECIMAL(5,2) DEFAULT 0.00,
    desktop_visitors INT DEFAULT 0,
    mobile_visitors INT DEFAULT 0,
    tablet_visitors INT DEFAULT 0,
    top_pages JSON, -- Store top pages as JSON array
    top_referrers JSON, -- Store top referrers as JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- Page-specific statistics
CREATE TABLE IF NOT EXISTS page_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    total_views INT DEFAULT 0,
    unique_views INT DEFAULT 0,
    avg_time_on_page INT DEFAULT 0, -- in seconds
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    exit_rate DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_page (page_path),
    INDEX idx_total_views (total_views),
    INDEX idx_last_updated (last_updated)
);

-- Real-time active users table
CREATE TABLE IF NOT EXISTS active_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    page_path VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_last_activity (last_activity)
);

-- Events tracking table for custom events
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    event_value INT,
    page_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_event_name (event_name),
    INDEX idx_created_at (created_at)
);

-- Geographic data table
CREATE TABLE IF NOT EXISTS geographic_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    visitors INT DEFAULT 0,
    sessions INT DEFAULT 0,
    page_views INT DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_location_date (country, city, date),
    INDEX idx_date (date),
    INDEX idx_country (country)
);

-- Device and browser statistics
CREATE TABLE IF NOT EXISTS device_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL,
    browser VARCHAR(100),
    os VARCHAR(100),
    visitors INT DEFAULT 0,
    sessions INT DEFAULT 0,
    page_views INT DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_device_date (device_type, browser, os, date),
    INDEX idx_date (date),
    INDEX idx_device_type (device_type)
);

-- Create indexes for better performance
CREATE INDEX idx_page_views_session_created ON page_views(session_id, created_at);
CREATE INDEX idx_sessions_start_end ON sessions(start_time, end_time);
CREATE INDEX idx_daily_stats_date_range ON daily_stats(date);
CREATE INDEX idx_events_session_created ON events(session_id, created_at);
