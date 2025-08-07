const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { featured, type, limit } = req.query;
    let query = 'SELECT id, title, description, event_date, event_time, end_time, location, event_type, is_featured, image_type, image_name, created_at, updated_at FROM events';
    let params = [];
    let conditions = [];

    if (featured === 'true') {
      conditions.push('is_featured = ?');
      params.push(true);
    }

    if (type) {
      conditions.push('event_type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY event_date ASC, event_time ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [events] = await pool.execute(query, params);

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [events] = await pool.execute(
      'SELECT id, title, description, event_date, event_time, end_time, location, event_type, is_featured, image_type, image_name, created_at, updated_at FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: events[0]
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new event (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('event_date').isDate().withMessage('Valid event date is required'),
  body('event_type').isIn(['service', 'meeting', 'outreach', 'youth', 'special']).withMessage('Valid event type is required')
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
      description,
      event_date,
      event_time,
      end_time,
      location,
      event_type,
      is_featured,
      image_data,
      image_type,
      image_name
    } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO events (title, description, event_date, event_time, end_time, location, event_type, is_featured, image_data, image_type, image_name, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, event_date, event_time || null, end_time || null, location || null, event_type, is_featured || false, image_data ? Buffer.from(image_data, 'base64') : null, image_type || null, image_name || null, req.user.id]
    );

    const [newEvent] = await pool.execute(
      'SELECT * FROM events WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent[0]
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update event (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('event_date').isDate().withMessage('Valid event date is required'),
  body('event_type').isIn(['service', 'meeting', 'outreach', 'youth', 'special']).withMessage('Valid event type is required')
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
      description,
      event_date,
      event_time,
      end_time,
      location,
      event_type,
      is_featured,
      image_data,
      image_type,
      image_name
    } = req.body;

    // Check if event exists
    const [existingEvents] = await pool.execute(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await pool.execute(
      'UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, end_time = ?, location = ?, event_type = ?, is_featured = ?, image_data = ?, image_type = ?, image_name = ? WHERE id = ?',
      [title, description || null, event_date, event_time || null, end_time || null, location || null, event_type, is_featured || false, image_data ? Buffer.from(image_data, 'base64') : null, image_type || null, image_name || null, id]
    );

    const [updatedEvent] = await pool.execute(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent[0]
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete event (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [existingEvents] = await pool.execute(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await pool.execute('DELETE FROM events WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get upcoming events
router.get('/upcoming/events', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [events] = await pool.execute(
      'SELECT id, title, description, event_date, event_time, end_time, location, event_type, is_featured, image_type, image_name, created_at, updated_at FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC, event_time ASC LIMIT ?',
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event image
router.get('/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT image_data, image_type, image_name FROM events WHERE id = ? AND image_data IS NOT NULL',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = rows[0];
    res.setHeader('Content-Type', image.image_type);
    res.setHeader('Content-Disposition', `inline; filename="${image.image_name}"`);
    res.send(image.image_data);
  } catch (error) {
    console.error('Error retrieving event image:', error);
    res.status(500).json({ success: false, message: 'Error retrieving image' });
  }
});

module.exports = router;