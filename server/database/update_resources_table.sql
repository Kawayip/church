-- Update resources table to match frontend requirements
USE larachurch;

-- Drop existing resources table if it exists
DROP TABLE IF EXISTS resources;

-- Create updated resources table
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_type ENUM('pdf', 'doc', 'video', 'audio', 'image', 'zip') NOT NULL,
    category ENUM('bulletins', 'sermons', 'study-guides', 'sabbath-school', 'music', 'health', 'youth', 'training', 'other') DEFAULT 'other',
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_data LONGBLOB NOT NULL,
    download_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_file_type (file_type),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at)
);

-- Insert sample resources
INSERT INTO resources (title, description, file_type, category, file_name, file_size, mime_type, file_data, download_count, is_featured) VALUES 
('Weekly Bulletin - January 4, 2025', 'Order of service, announcements, and prayer requests for this week\'s Sabbath service.', 'pdf', 'bulletins', 'bulletin-2025-01-04.pdf', 2400000, 'application/pdf', '', 145, TRUE),
('Sermon: Walking by Faith', 'Pastor John\'s inspiring message about trusting God in uncertain times.', 'audio', 'sermons', 'walking-by-faith.mp3', 45200000, 'audio/mpeg', '', 289, TRUE),
('Bible Study Guide: Book of Daniel', 'Comprehensive 13-week study guide exploring the prophetic book of Daniel.', 'pdf', 'study-guides', 'daniel-study-guide.pdf', 5700000, 'application/pdf', '', 432, FALSE),
('Children\'s Sabbath School Materials', 'Lesson plans, activities, and crafts for children ages 5-12.', 'zip', 'sabbath-school', 'children-ss-materials.zip', 12400000, 'application/zip', '', 78, FALSE),
('Hymnal Collection - Traditional Favorites', 'Sheet music and audio recordings of beloved traditional hymns.', 'zip', 'music', 'traditional-hymns.zip', 87300000, 'application/zip', '', 203, FALSE),
('Health Ministry: Plant-Based Recipes', 'Delicious and nutritious plant-based recipes for healthy living.', 'pdf', 'health', 'plant-based-recipes.pdf', 3100000, 'application/pdf', '', 167, FALSE),
('Youth Ministry Devotional', 'Daily devotions specifically designed for teenagers and young adults.', 'pdf', 'youth', 'youth-devotional.pdf', 2800000, 'application/pdf', '', 124, FALSE),
('Evangelism Training Video Series', 'Complete video course on effective personal evangelism methods.', 'video', 'training', 'evangelism-training.mp4', 1200000000, 'video/mp4', '', 89, TRUE); 