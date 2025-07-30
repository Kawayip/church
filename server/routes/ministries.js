const express = require('express');
const multer = require('multer');
const { pool } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// GET all ministries (public)
router.get('/', async (req, res) => {
  try {
    console.log('Ministries GET request received:', req.query);
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, name, slug, description, long_description, leader_name, leader_email, leader_phone, meeting_time, meeting_location, contact_info, requirements, age_group, status, featured_image_data, featured_image_type, featured_image_name, created_at, updated_at
      FROM ministries 
    `;
    
    let countQuery = `SELECT COUNT(*) as total FROM ministries`;
    let queryParams = [];
    let countParams = [];
    
    // Handle status filtering
    if (status && status !== 'all') {
      query += ` WHERE status = ?`;
      countQuery += ` WHERE status = ?`;
      queryParams.push(status);
      countParams.push(status);
    }
    
    console.log('Executing query:', query + ` ORDER BY name ASC LIMIT ? OFFSET ?`);
    console.log('Query params:', [...queryParams, parseInt(limit), offset]);
    
    const [ministries] = await pool.execute(query + ` ORDER BY name ASC LIMIT ? OFFSET ?`, [...queryParams, parseInt(limit), offset]);
    const [countResult] = await pool.execute(countQuery, countParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    console.log('Ministries found:', ministries.length);
    console.log('Total ministries:', total);

    res.json({
      success: true,
      data: ministries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ministries:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch ministries', error: error.message });
  }
});

// GET single ministry by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const [ministries] = await pool.execute(
      'SELECT id, name, slug, description, long_description, leader_name, leader_email, leader_phone, meeting_time, meeting_location, contact_info, requirements, age_group, status, featured_image_data, featured_image_type, featured_image_name, created_at, updated_at FROM ministries WHERE slug = ?',
      [slug]
    );

    if (ministries.length === 0) {
      return res.status(404).json({ success: false, message: 'Ministry not found' });
    }

    res.json({ success: true, data: ministries[0] });
  } catch (error) {
    console.error('Error fetching ministry:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ministry' });
  }
});

// GET ministry image
router.get('/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [ministries] = await pool.execute(
      'SELECT featured_image_data, featured_image_type FROM ministries WHERE id = ?',
      [id]
    );

    if (ministries.length === 0 || !ministries[0].featured_image_data) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const ministry = ministries[0];
    
    // Set CORS headers for image serving
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', ministry.featured_image_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    res.send(ministry.featured_image_data);
  } catch (error) {
    console.error('Error serving ministry image:', error);
    res.status(500).json({ success: false, message: 'Failed to serve image' });
  }
});

// OPTIONS for image endpoint
router.options('/:id/image', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// POST create new ministry (admin only)
router.post('/', authenticateToken, upload.single('featured_image'), async (req, res) => {
  try {
    const {
      name,
      description,
      long_description,
      leader_name,
      leader_email,
      leader_phone,
      meeting_time,
      meeting_location,
      contact_info,
      requirements,
      age_group,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    // Generate slug
    const slug = generateSlug(name);

    // Check if slug already exists
    const [existing] = await pool.execute('SELECT id FROM ministries WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'A ministry with this name already exists' });
    }

    // Prepare ministry data
    const ministryData = {
      name,
      slug,
      description,
      long_description: long_description || null,
      leader_name: leader_name || null,
      leader_email: leader_email || null,
      leader_phone: leader_phone || null,
      meeting_time: meeting_time || null,
      meeting_location: meeting_location || null,
      contact_info: contact_info || null,
      requirements: requirements || null,
      age_group: age_group || null,
      status
    };

    // Add image data if uploaded
    if (req.file) {
      ministryData.featured_image_data = req.file.buffer;
      ministryData.featured_image_type = req.file.mimetype;
      ministryData.featured_image_name = req.file.originalname;
    }

    // Insert ministry
    const [result] = await pool.execute(
      `INSERT INTO ministries (
        name, slug, description, long_description, leader_name, leader_email, leader_phone,
        meeting_time, meeting_location, contact_info, requirements, age_group, status,
        featured_image_data, featured_image_type, featured_image_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ministryData.name, ministryData.slug, ministryData.description, ministryData.long_description,
        ministryData.leader_name, ministryData.leader_email, ministryData.leader_phone,
        ministryData.meeting_time, ministryData.meeting_location, ministryData.contact_info,
        ministryData.requirements, ministryData.age_group, ministryData.status,
        ministryData.featured_image_data, ministryData.featured_image_type, ministryData.featured_image_name
      ]
    );

    // Fetch the created ministry
    const [newMinistry] = await pool.execute('SELECT * FROM ministries WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Ministry created successfully',
      data: newMinistry[0]
    });
  } catch (error) {
    console.error('Error creating ministry:', error);
    res.status(500).json({ success: false, message: 'Failed to create ministry' });
  }
});

// PUT update ministry (admin only)
router.put('/:id', authenticateToken, upload.single('featured_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      long_description,
      leader_name,
      leader_email,
      leader_phone,
      meeting_time,
      meeting_location,
      contact_info,
      requirements,
      age_group,
      status,
      remove_image
    } = req.body;

    // Check if ministry exists
    const [existing] = await pool.execute('SELECT * FROM ministries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Ministry not found' });
    }

    // Prepare update fields
    const updateFields = {
      name: name || existing[0].name,
      description: description || existing[0].description,
      long_description: long_description !== undefined ? long_description : existing[0].long_description,
      leader_name: leader_name !== undefined ? leader_name : existing[0].leader_name,
      leader_email: leader_email !== undefined ? leader_email : existing[0].leader_email,
      leader_phone: leader_phone !== undefined ? leader_phone : existing[0].leader_phone,
      meeting_time: meeting_time !== undefined ? meeting_time : existing[0].meeting_time,
      meeting_location: meeting_location !== undefined ? meeting_location : existing[0].meeting_location,
      contact_info: contact_info !== undefined ? contact_info : existing[0].contact_info,
      requirements: requirements !== undefined ? requirements : existing[0].requirements,
      age_group: age_group !== undefined ? age_group : existing[0].age_group,
      status: status || existing[0].status
    };

    // Generate new slug if name changed
    if (name && name !== existing[0].name) {
      const newSlug = generateSlug(name);
      const [slugExists] = await pool.execute('SELECT id FROM ministries WHERE slug = ? AND id != ?', [newSlug, id]);
      if (slugExists.length > 0) {
        return res.status(400).json({ success: false, message: 'A ministry with this name already exists' });
      }
      updateFields.slug = newSlug;
    }

    // Handle image updates
    if (req.file) {
      updateFields.featured_image_data = req.file.buffer;
      updateFields.featured_image_type = req.file.mimetype;
      updateFields.featured_image_name = req.file.originalname;
    } else if (remove_image === 'true' || remove_image === true) {
      updateFields.featured_image_data = null;
      updateFields.featured_image_type = null;
      updateFields.featured_image_name = null;
    }

    // Remove remove_image from updateFields as it's not a database column
    delete updateFields.remove_image;

    // Build update query
    const setClause = Object.keys(updateFields)
      .filter(key => updateFields[key] !== undefined)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.keys(updateFields)
      .filter(key => updateFields[key] !== undefined)
      .map(key => updateFields[key]);

    if (setClause) {
      await pool.execute(`UPDATE ministries SET ${setClause} WHERE id = ?`, [...values, id]);
    }

    // Fetch updated ministry
    const [updated] = await pool.execute('SELECT * FROM ministries WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Ministry updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating ministry:', error);
    res.status(500).json({ success: false, message: 'Failed to update ministry' });
  }
});

// DELETE ministry (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ministry exists
    const [existing] = await pool.execute('SELECT id FROM ministries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Ministry not found' });
    }

    // Delete ministry
    await pool.execute('DELETE FROM ministries WHERE id = ?', [id]);

    res.json({ success: true, message: 'Ministry deleted successfully' });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete ministry' });
  }
});

module.exports = router; 