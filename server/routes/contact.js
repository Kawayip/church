const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact message
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all contact messages (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { unread, limit } = req.query;
    let query = 'SELECT * FROM contact_messages';
    let params = [];

    if (unread === 'true') {
      query += ' WHERE is_read = false';
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [messages] = await pool.execute(query, params);

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single contact message (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: messages[0]
    });

  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark message as read (Admin only)
router.put('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [existingMessages] = await pool.execute(
      'SELECT id FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existingMessages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await pool.execute(
      'UPDATE contact_messages SET is_read = true WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete contact message (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [existingMessages] = await pool.execute(
      'SELECT id FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existingMessages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unread messages count (Admin only)
router.get('/unread/count', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false'
    );

    res.json({
      success: true,
      count: result[0].count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 