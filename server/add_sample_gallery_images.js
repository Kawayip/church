const { pool } = require('./database/connection');
const fs = require('fs');
const path = require('path');

// Sample gallery images data
const sampleImages = [
  {
    title: 'Sabbath Worship Service',
    description: 'Beautiful moments from our Sabbath worship service with the congregation gathered in praise',
    category: 'services',
    imageName: 'sabbath-worship.jpg',
    imageType: 'image/jpeg'
  },
  {
    title: 'Youth Ministry Retreat',
    description: 'Young people growing in faith together during our annual youth retreat',
    category: 'youth',
    imageName: 'youth-retreat.jpg',
    imageType: 'image/jpeg'
  },
  {
    title: 'Community Health Fair',
    description: 'Serving our community with health and wellness screenings and education',
    category: 'outreach',
    imageName: 'health-fair.jpg',
    imageType: 'image/jpeg'
  },
  {
    title: 'Baptism Ceremony',
    description: 'Celebrating new life in Christ through baptism',
    category: 'services',
    imageName: 'baptism.jpg',
    imageType: 'image/jpeg'
  },
  {
    title: 'Women\'s Ministry Meeting',
    description: 'Women supporting and encouraging each other in faith',
    category: 'general',
    imageName: 'womens-ministry.jpg',
    imageType: 'image/jpeg'
  },
  {
    title: 'Children\'s Sabbath School',
    description: 'Children learning about God\'s love through stories and activities',
    category: 'youth',
    imageName: 'children-ss.jpg',
    imageType: 'image/jpeg'
  }
];

// Create a simple placeholder image (1x1 pixel transparent PNG)
const createPlaceholderImage = () => {
  // Base64 encoded 1x1 transparent PNG
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
};

async function addSampleGalleryImages() {
  try {
    console.log('Adding sample gallery images...');
    
    // Get admin user ID
    const [users] = await pool.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    if (users.length === 0) {
      console.error('No admin user found. Please run the database schema first.');
      return;
    }
    
    const adminUserId = users[0].id;
    const placeholderImage = createPlaceholderImage();
    
    for (const image of sampleImages) {
      const [result] = await pool.execute(
        'INSERT INTO gallery (title, description, image_data, image_type, image_name, category, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          image.title,
          image.description,
          Buffer.from(placeholderImage, 'base64'),
          image.imageType,
          image.imageName,
          image.category,
          adminUserId
        ]
      );
      
      console.log(`Added image: ${image.title} (ID: ${result.insertId})`);
    }
    
    console.log('Sample gallery images added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample gallery images:', error);
    process.exit(1);
  }
}

// Run the script
addSampleGalleryImages(); 