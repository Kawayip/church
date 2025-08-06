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
      database: process.env.DB_NAME || 'larachurch',
      multipleStatements: true
    });

    console.log('Connected to database');

    // Read and execute the update script
    const updateScript = fs.readFileSync(path.join(__dirname, 'database', 'update_resources_table.sql'), 'utf8');
    
    console.log('Executing database update...');
    await connection.execute(updateScript);
    
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