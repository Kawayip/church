const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAnalyticsSetup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'larachurch',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('Testing analytics setup...');
    
    // Check if page_views table exists
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('page_views', 'sessions', 'active_users')
    `, [process.env.DB_NAME || 'larachurch']);
    
    console.log('Existing analytics tables:', tables.map(t => t.TABLE_NAME));
    
    if (tables.length < 3) {
      console.log('Some analytics tables are missing. Creating them...');
      
      // Create page_views table
      await connection.execute(`
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
          time_on_page INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_session_id (session_id),
          INDEX idx_page_path (page_path),
          INDEX idx_created_at (created_at)
        )
      `);
      
      // Create sessions table
      await connection.execute(`
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
          duration INT DEFAULT 0,
          page_count INT DEFAULT 1,
          is_bounce BOOLEAN DEFAULT TRUE,
          referrer VARCHAR(500),
          landing_page VARCHAR(500),
          exit_page VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_user_id (user_id),
          INDEX idx_start_time (start_time)
        )
      `);
      
      // Create active_users table
      await connection.execute(`
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
        )
      `);
      
      console.log('✅ Analytics tables created successfully!');
    } else {
      console.log('✅ All analytics tables exist!');
    }
    
  } catch (error) {
    console.error('❌ Error testing analytics setup:', error);
  } finally {
    await connection.end();
  }
}

testAnalyticsSetup();
