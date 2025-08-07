const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { pool } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Helper function to extract tags from string
const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
};

// GET /api/posts - Get all posts (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      featured,
      author_id
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    // Build WHERE conditions
    if (status && status !== 'all') {
      whereConditions.push('p.status = ?');
      params.push(status);
    }

    if (category && category !== 'all') {
      whereConditions.push('p.category = ?');
      params.push(category);
    }

    if (search) {
      whereConditions.push('(p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (featured === 'true') {
      whereConditions.push('p.is_featured = ?');
      params.push(true);
    }

    if (author_id) {
      whereConditions.push('p.author_id = ?');
      params.push(author_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM posts p ${whereClause}`,
      params
    );
    const totalPosts = countResult[0].total;

    // Get posts with author information
    const [posts] = await pool.execute(
      `SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.email as author_email
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Parse tags for each post
    const postsWithParsedTags = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));

    res.json({
      success: true,
      data: postsWithParsedTags,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/posts/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND category != "" ORDER BY category'
    );

    res.json({
      success: true,
      data: categories.map(cat => cat.category)
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// OPTIONS /api/posts/:id/image - Handle preflight requests
router.options('/:id/image', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// GET /api/posts/:id/image - Get post featured image
router.get('/:id/image', async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.execute(
      'SELECT featured_image_data, featured_image_type, featured_image_name FROM posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0 || !posts[0].featured_image_data) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const post = posts[0];

    // Set CORS headers for image requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Set appropriate headers
    res.setHeader('Content-Type', post.featured_image_type);
    res.setHeader('Content-Disposition', `inline; filename="${post.featured_image_name}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send the image data
    res.send(post.featured_image_data);

  } catch (error) {
    console.error('Error serving post image:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.execute(
      `SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.email as author_email
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = posts[0];
    post.tags = post.tags ? JSON.parse(post.tags) : [];

    // Increment view count
    await pool.execute(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/posts - Create new post (admin only)
router.post('/', [
  authenticateToken,
  upload.single('featured_image'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('tags').optional().isString().withMessage('Tags must be a string'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('is_featured').optional().isBoolean().withMessage('is_featured must be a boolean'),
  body('meta_title').optional().isLength({ max: 200 }).withMessage('Meta title must be less than 200 characters'),
  body('meta_description').optional().isLength({ max: 500 }).withMessage('Meta description must be less than 500 characters')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      content,
      excerpt,
      category = 'General',
      tags,
      status = 'draft',
      is_featured = false,
      meta_title,
      meta_description
    } = req.body;

    // Generate slug
    const slug = generateSlug(title);
    
    // Check if slug already exists
    const [existingSlugs] = await pool.execute(
      'SELECT id FROM posts WHERE slug = ?',
      [slug]
    );

    if (existingSlugs.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }

    // Parse tags
    const parsedTags = parseTags(tags);

    // Set published_at if status is published
    const publishedAt = status === 'published' ? new Date() : null;

    // Handle image upload
    let imageData = null;
    let imageType = null;
    let imageName = null;

    if (req.file) {
      imageData = req.file.buffer;
      imageType = req.file.mimetype;
      imageName = req.file.originalname;
    }

    const [result] = await pool.execute(
      `INSERT INTO posts (
        title, content, excerpt, author_id, status, category, tags, 
        slug, meta_title, meta_description, is_featured, published_at,
        featured_image_data, featured_image_type, featured_image_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        excerpt || null,
        req.user.id,
        status,
        category,
        JSON.stringify(parsedTags),
        slug,
        meta_title || null,
        meta_description || null,
        is_featured,
        publishedAt,
        imageData,
        imageType,
        imageName
      ]
    );

    // Get the created post
    const [newPost] = await pool.execute(
      `SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.email as author_email
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    const post = newPost[0];
    post.tags = parsedTags;

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/posts/:id - Update post (admin only)
router.put('/:id', [
  authenticateToken,
  upload.single('featured_image'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('tags').optional().isString().withMessage('Tags must be a string'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('is_featured').optional().isBoolean().withMessage('is_featured must be a boolean'),
  body('meta_title').optional().isLength({ max: 200 }).withMessage('Meta title must be less than 200 characters'),
  body('meta_description').optional().isLength({ max: 500 }).withMessage('Meta description must be less than 500 characters')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateFields = req.body;

    // Check if post exists
    const [existingPosts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );

    if (existingPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingPost = existingPosts[0];

    // Generate new slug if title changed
    if (updateFields.title && updateFields.title !== existingPost.title) {
      const newSlug = generateSlug(updateFields.title);
      
      // Check if new slug already exists
      const [existingSlugs] = await pool.execute(
        'SELECT id FROM posts WHERE slug = ? AND id != ?',
        [newSlug, id]
      );

      if (existingSlugs.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'A post with this title already exists'
        });
      }

      updateFields.slug = newSlug;
    }

    // Parse tags if provided
    if (updateFields.tags) {
      updateFields.tags = JSON.stringify(parseTags(updateFields.tags));
    }

    // Set published_at if status is changing to published
    if (updateFields.status === 'published' && existingPost.status !== 'published') {
      updateFields.published_at = new Date();
    }

    // Handle image upload
    if (req.file) {
      updateFields.featured_image_data = req.file.buffer;
      updateFields.featured_image_type = req.file.mimetype;
      updateFields.featured_image_name = req.file.originalname;
    }

    // Handle image removal (if remove_image is true)
    if (updateFields.remove_image === 'true' || updateFields.remove_image === true) {
      updateFields.featured_image_data = null;
      updateFields.featured_image_type = null;
      updateFields.featured_image_name = null;
    }
    
    // Remove remove_image from updateFields as it's not a database column
    delete updateFields.remove_image;

    // Build update query
    const updateColumns = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const updateValues = Object.values(updateFields);

    await pool.execute(
      `UPDATE posts SET ${updateColumns} WHERE id = ?`,
      [...updateValues, id]
    );

    // Get the updated post
    const [updatedPosts] = await pool.execute(
      `SELECT 
        p.*,
        u.first_name,
        u.last_name,
        u.email as author_email
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    const post = updatedPosts[0];
    post.tags = post.tags ? JSON.parse(post.tags) : [];

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });

  } catch (error) {
    console.error('Error updating post:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
});

// DELETE /api/posts/:id - Delete post (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Check if post exists
    const [existingPosts] = await pool.execute(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (existingPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Delete the post
    await pool.execute('DELETE FROM posts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 