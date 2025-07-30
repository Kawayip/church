const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all sermons
router.get('/', async (req, res) => {
  try {
    const { featured, preacher, limit } = req.query;
    let query = 'SELECT * FROM sermons';
    let params = [];
    let conditions = [];

    if (featured === 'true') {
      conditions.push('is_featured = ?');
      params.push(true);
    }

    if (preacher) {
      conditions.push('preacher LIKE ?');
      params.push(`%${preacher}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY sermon_date DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [sermons] = await pool.execute(query, params);

    res.json({
      success: true,
      data: sermons
    });

  } catch (error) {
    console.error('Get sermons error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single sermon
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [sermons] = await pool.execute(
      'SELECT * FROM sermons WHERE id = ?',
      [id]
    );

    if (sermons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sermon not found'
      });
    }

    res.json({
      success: true,
      data: sermons[0]
    });

  } catch (error) {
    console.error('Get sermon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new sermon (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('preacher').notEmpty().withMessage('Preacher is required'),
  body('sermon_date').isDate().withMessage('Valid sermon date is required')
], async (req, res) => {
  try {
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
      preacher,
      sermon_date,
      scripture_reference,
      description,
      video_url,
      audio_url,
      notes_url,
      duration_minutes,
      is_featured
    } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO sermons (title, preacher, sermon_date, scripture_reference, description, video_url, audio_url, notes_url, duration_minutes, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, preacher, sermon_date, scripture_reference || null, description || null, video_url || null, audio_url || null, notes_url || null, duration_minutes || null, is_featured || false]
    );

    const [newSermon] = await pool.execute(
      'SELECT * FROM sermons WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Sermon created successfully',
      data: newSermon[0]
    });

  } catch (error) {
    console.error('Create sermon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update sermon (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('preacher').notEmpty().withMessage('Preacher is required'),
  body('sermon_date').isDate().withMessage('Valid sermon date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      title,
      preacher,
      sermon_date,
      scripture_reference,
      description,
      video_url,
      audio_url,
      notes_url,
      duration_minutes,
      is_featured
    } = req.body;

    // Check if sermon exists
    const [existingSermons] = await pool.execute(
      'SELECT id FROM sermons WHERE id = ?',
      [id]
    );

    if (existingSermons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sermon not found'
      });
    }

    await pool.execute(
      'UPDATE sermons SET title = ?, preacher = ?, sermon_date = ?, scripture_reference = ?, description = ?, video_url = ?, audio_url = ?, notes_url = ?, duration_minutes = ?, is_featured = ? WHERE id = ?',
      [title, preacher, sermon_date, scripture_reference || null, description || null, video_url || null, audio_url || null, notes_url || null, duration_minutes || null, is_featured || false, id]
    );

    const [updatedSermon] = await pool.execute(
      'SELECT * FROM sermons WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Sermon updated successfully',
      data: updatedSermon[0]
    });

  } catch (error) {
    console.error('Update sermon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete sermon (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sermon exists
    const [existingSermons] = await pool.execute(
      'SELECT id FROM sermons WHERE id = ?',
      [id]
    );

    if (existingSermons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sermon not found'
      });
    }

    await pool.execute('DELETE FROM sermons WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Sermon deleted successfully'
    });

  } catch (error) {
    console.error('Delete sermon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get latest sermons
router.get('/latest/sermons', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [sermons] = await pool.execute(
      'SELECT * FROM sermons ORDER BY sermon_date DESC LIMIT ?',
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: sermons
    });

  } catch (error) {
    console.error('Get latest sermons error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get sermons by preacher
router.get('/preacher/:preacher', async (req, res) => {
  try {
    const { preacher } = req.params;
    const { limit } = req.query;

    let query = 'SELECT * FROM sermons WHERE preacher LIKE ? ORDER BY sermon_date DESC';
    let params = [`%${preacher}%`];

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [sermons] = await pool.execute(query, params);

    res.json({
      success: true,
      data: sermons
    });

  } catch (error) {
    console.error('Get sermons by preacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 