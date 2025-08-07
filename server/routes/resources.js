const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../database/connection');

// Get all resources with optional filtering (metadata only for faster loading)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, featured } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let params = [];
    
    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }
    
    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (featured !== undefined) {
      whereConditions.push('is_featured = ?');
      params.push(featured === 'true' ? 1 : 0);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM resources ${whereClause}`,
      params
    );
    const total = countResult[0].total;
    
    // Get resources (excluding file_data for faster loading)
    const [resources] = await pool.execute(
      `SELECT id, title, description, file_type, category, file_name, file_size, mime_type, download_count, is_featured, created_at, updated_at 
       FROM resources ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [resources] = await pool.execute(
      'SELECT id, title, description, file_type, category, file_name, file_size, mime_type, download_count, is_featured, created_at, updated_at FROM resources WHERE id = ?',
      [id]
    );
    
    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    res.json({
      success: true,
      data: resources[0]
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
});

// Create new resource
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, fileType, category, fileData, mimeType, fileName, fileSize, isFeatured } = req.body;
    
    // Validate required fields
    if (!title || !fileType || !category || !fileData || !mimeType || !fileName || !fileSize) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Insert resource
    const [result] = await pool.execute(
      `INSERT INTO resources (title, description, file_type, category, file_data, mime_type, file_name, file_size, is_featured, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, fileType, category, Buffer.from(fileData, 'base64'), mimeType, fileName, fileSize, isFeatured ? 1 : 0]
    );
    
    const resourceId = result.insertId;
    
    // Get the created resource
    const [resources] = await pool.execute(
      'SELECT id, title, description, file_type, category, file_name, file_size, mime_type, download_count, is_featured, created_at, updated_at FROM resources WHERE id = ?',
      [resourceId]
    );
    
    res.status(201).json({
      success: true,
      data: resources[0],
      message: 'Resource created successfully'
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
});

// Update resource
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, isFeatured } = req.body;
    
    // Check if resource exists
    const [existingResources] = await pool.execute(
      'SELECT id, title, description, file_type, category, file_name, file_size, mime_type, download_count, is_featured, created_at, updated_at FROM resources WHERE id = ?',
      [id]
    );
    
    if (existingResources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Update resource
    await pool.execute(
      `UPDATE resources 
       SET title = ?, description = ?, category = ?, is_featured = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, category, isFeatured ? 1 : 0, id]
    );
    
    // Get updated resource
    const [resources] = await pool.execute(
      'SELECT id, title, description, file_type, category, file_name, file_size, mime_type, download_count, is_featured, created_at, updated_at FROM resources WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      data: resources[0],
      message: 'Resource updated successfully'
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
});

// Delete resource
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if resource exists
    const [existingResources] = await pool.execute(
      'SELECT id FROM resources WHERE id = ?',
      [id]
    );
    
    if (existingResources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Delete resource
    await pool.execute('DELETE FROM resources WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
});

// Track download
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment download count
    await pool.execute(
      'UPDATE resources SET download_count = download_count + 1 WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Download tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track download',
      error: error.message
    });
  }
});

// Get resource categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM resources ORDER BY category'
    );
    
    const categoryList = categories.map(cat => cat.category);
    
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

module.exports = router; 