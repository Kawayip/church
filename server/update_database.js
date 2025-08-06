const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

async function updateDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'larachurch'
    });

    console.log('Connected to database');

    // Drop existing table
    console.log('Dropping existing resources table...');
    await connection.execute('DROP TABLE IF EXISTS resources');
    
    // Create new table
    console.log('Creating new resources table...');
    await connection.execute(`
      CREATE TABLE resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        file_type ENUM('pdf', 'doc', 'video', 'audio', 'image', 'zip') NOT NULL,
        category ENUM('bulletins', 'sermons', 'study-guides', 'sabbath-school', 'music', 'health', 'youth', 'training', 'other') DEFAULT 'other',
        file_name VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_data LONGBLOB,
        download_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_file_type (file_type),
        INDEX idx_is_featured (is_featured),
        INDEX idx_created_at (created_at)
      )
    `);
    
    // Insert sample data
    console.log('Inserting sample resources...');
    const sampleResources = [
      ['Weekly Bulletin - January 4, 2025', 'Order of service, announcements, and prayer requests for this week\'s Sabbath service.', 'pdf', 'bulletins', 'bulletin-2025-01-04.pdf', 2400000, 'application/pdf', null, 145, true],
      ['Sermon: Walking by Faith', 'Pastor John\'s inspiring message about trusting God in uncertain times.', 'audio', 'sermons', 'walking-by-faith.mp3', 45200000, 'audio/mpeg', null, 289, true],
      ['Bible Study Guide: Book of Daniel', 'Comprehensive 13-week study guide exploring the prophetic book of Daniel.', 'pdf', 'study-guides', 'daniel-study-guide.pdf', 5700000, 'application/pdf', null, 432, false],
      ['Children\'s Sabbath School Materials', 'Lesson plans, activities, and crafts for children ages 5-12.', 'zip', 'sabbath-school', 'children-ss-materials.zip', 12400000, 'application/zip', null, 78, false],
      ['Hymnal Collection - Traditional Favorites', 'Sheet music and audio recordings of beloved traditional hymns.', 'zip', 'music', 'traditional-hymns.zip', 87300000, 'application/zip', null, 203, false],
      ['Health Ministry: Plant-Based Recipes', 'Delicious and nutritious plant-based recipes for healthy living.', 'pdf', 'health', 'plant-based-recipes.pdf', 3100000, 'application/pdf', null, 167, false],
      ['Youth Ministry Devotional', 'Daily devotions specifically designed for teenagers and young adults.', 'pdf', 'youth', 'youth-devotional.pdf', 2800000, 'application/pdf', null, 124, false],
      ['Evangelism Training Video Series', 'Complete video course on effective personal evangelism methods.', 'video', 'training', 'evangelism-training.mp4', 1200000000, 'video/mp4', null, 89, true]
    ];
    
    for (const resource of sampleResources) {
      await connection.execute(
        'INSERT INTO resources (title, description, file_type, category, file_name, file_size, mime_type, file_data, download_count, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        resource
      );
    }
    
    console.log('Database updated successfully!');
    
    // Test the new table
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM resources');
    console.log(`Resources table now contains ${rows[0].count} records`);
    
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updateDatabase(); 