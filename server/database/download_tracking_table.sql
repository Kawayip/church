-- Download Tracking Table
-- This table stores information about file downloads for analytics

CREATE TABLE IF NOT EXISTS download_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  user_id VARCHAR(100),
  session_id VARCHAR(100) NOT NULL,
  download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_file_name (file_name),
  INDEX idx_file_type (file_type),
  INDEX idx_download_time (download_time),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_ip_address (ip_address)
);

-- Add some sample data for testing
INSERT INTO download_tracking (file_name, file_url, file_type, user_agent, session_id) VALUES
('Sabbath_School_Lesson_1.pdf', '/documents/sabbath-school-lesson-1.pdf', 'PDF Document', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'session_1234567890_abc123'),
('Church_Bulletin_Week_1.pdf', '/documents/church-bulletin-week-1.pdf', 'PDF Document', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'session_1234567890_def456'),
('Prayer_Request_Form.docx', '/documents/prayer-request-form.docx', 'Word Document', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'session_1234567890_ghi789'),
('Sermon_Notes_Template.docx', '/documents/sermon-notes-template.docx', 'Word Document', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'session_1234567890_jkl012'),
('Church_Calendar_2024.xlsx', '/documents/church-calendar-2024.xlsx', 'Excel Spreadsheet', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'session_1234567890_mno345'); 