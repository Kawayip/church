const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupAnalyticsTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'larachurch',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('Setting up analytics tables...');
    
    // Read the analytics tables SQL file
    const analyticsTablesPath = path.join(__dirname, 'database', 'analytics_tables.sql');
    const sql = fs.readFileSync(analyticsTablesPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_DUP_KEYNAME') {
            console.log('⚠️  Index already exists, skipping...');
          } else {
            console.error('❌ Error executing statement:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Analytics tables setup completed!');
  } catch (error) {
    console.error('❌ Error setting up analytics tables:', error);
  } finally {
    await connection.end();
  }
}

setupAnalyticsTables();
