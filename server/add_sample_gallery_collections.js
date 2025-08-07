const { pool } = require('./database/connection');

// Sample gallery collections data
const sampleCollections = [
  {
    title: 'Saturday Service Photos',
    description: 'Beautiful moments from our Saturday worship service with the congregation gathered in praise and fellowship',
    category: 'services',
    images: [
      { title: 'Worship Time', description: 'Congregation singing praises' },
      { title: 'Prayer Time', description: 'Members praying together' },
      { title: 'Fellowship', description: 'After service fellowship' },
      { title: 'Children\'s Ministry', description: 'Kids learning about God' }
    ]
  },
  {
    title: 'Youth Ministry Retreat',
    description: 'Young people growing in faith together during our annual youth retreat in the mountains',
    category: 'youth',
    images: [
      { title: 'Group Photo', description: 'All youth participants' },
      { title: 'Bible Study', description: 'Deep discussions about faith' },
      { title: 'Outdoor Activities', description: 'Team building exercises' },
      { title: 'Worship Session', description: 'Contemporary worship' },
      { title: 'Campfire', description: 'Evening devotion around the fire' }
    ]
  },
  {
    title: 'Community Health Fair',
    description: 'Serving our community with health and wellness screenings, education, and care',
    category: 'outreach',
    images: [
      { title: 'Health Screening', description: 'Free health checkups' },
      { title: 'Education Booth', description: 'Health education materials' },
      { title: 'Volunteers', description: 'Our dedicated volunteers' },
      { title: 'Community Members', description: 'People from our community' }
    ]
  }
];

// Create a simple placeholder image (1x1 pixel transparent PNG)
const createPlaceholderImage = () => {
  // Base64 encoded 1x1 transparent PNG
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
};

async function addSampleGalleryCollections() {
  try {
    console.log('Adding sample gallery collections...');
    
    // Get admin user ID
    const [users] = await pool.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    if (users.length === 0) {
      console.error('No admin user found. Please run the database schema first.');
      return;
    }
    
    const adminUserId = users[0].id;
    const placeholderImage = createPlaceholderImage();
    
    for (const collection of sampleCollections) {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Create collection
        const [collectionResult] = await connection.execute(
          'INSERT INTO gallery_collections (title, description, category, uploaded_by) VALUES (?, ?, ?, ?)',
          [collection.title, collection.description, collection.category, adminUserId]
        );

        const collectionId = collectionResult.insertId;
        let thumbnailImageId = null;

        // Insert images
        for (let i = 0; i < collection.images.length; i++) {
          const image = collection.images[i];
          const [imageResult] = await connection.execute(
            'INSERT INTO gallery_images (collection_id, title, description, image_data, image_type, image_name, sort_order, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              collectionId,
              image.title,
              image.description,
              Buffer.from(placeholderImage, 'base64'),
              'image/png',
              `${image.title.toLowerCase().replace(/\s+/g, '-')}.png`,
              i,
              adminUserId
            ]
          );

          // Set first image as thumbnail
          if (i === 0) {
            thumbnailImageId = imageResult.insertId;
          }
        }

        // Update collection with thumbnail
        await connection.execute(
          'UPDATE gallery_collections SET thumbnail_image_id = ? WHERE id = ?',
          [thumbnailImageId, collectionId]
        );

        await connection.commit();
        console.log(`Added collection: ${collection.title} (ID: ${collectionId}, Images: ${collection.images.length})`);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
    
    console.log('Sample gallery collections added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample gallery collections:', error);
    process.exit(1);
  }
}

// Run the script
addSampleGalleryCollections(); 