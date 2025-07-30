const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Upload image to gallery
router.post('/gallery', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('category').isIn(['events', 'services', 'outreach', 'youth', 'general']).withMessage('Invalid category'),
    body('imageData').notEmpty().withMessage('Image data is required'),
    body('imageType').notEmpty().withMessage('Image type is required'),
    body('imageName').notEmpty().withMessage('Image name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, category, imageData, imageType, imageName } = req.body;
        const uploadedBy = req.user.id;

        const [result] = await pool.execute(
            'INSERT INTO gallery (title, description, image_data, image_type, image_name, category, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, Buffer.from(imageData, 'base64'), imageType, imageName, category, uploadedBy]
        );

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
});

// Get image from gallery
router.get('/gallery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT image_data, image_type, image_name FROM gallery WHERE id = ?',
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
        console.error('Error retrieving image:', error);
        res.status(500).json({ success: false, message: 'Error retrieving image' });
    }
});

// Upload resource file
router.post('/resources', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('fileType').isIn(['pdf', 'doc', 'video', 'audio', 'image']).withMessage('Invalid file type'),
    body('category').isIn(['study', 'music', 'announcement', 'form', 'other']).withMessage('Invalid category'),
    body('fileData').notEmpty().withMessage('File data is required'),
    body('mimeType').notEmpty().withMessage('MIME type is required'),
    body('fileName').notEmpty().withMessage('File name is required'),
    body('fileSize').isInt({ min: 1 }).withMessage('File size is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, fileType, category, fileData, mimeType, fileName, fileSize } = req.body;
        const uploadedBy = req.user.id;

        const [result] = await pool.execute(
            'INSERT INTO resources (title, description, file_data, file_type, file_name, mime_type, file_size, category, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, Buffer.from(fileData, 'base64'), fileType, fileName, mimeType, fileSize, category, uploadedBy]
        );

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ success: false, message: 'Error uploading file' });
    }
});

// Get resource file
router.get('/resources/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT file_data, mime_type, file_name FROM resources WHERE id = ? AND is_public = TRUE',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'File not found or not public' });
        }

        const file = rows[0];
        res.setHeader('Content-Type', file.mime_type);
        res.setHeader('Content-Disposition', `inline; filename="${file.file_name}"`);
        res.send(file.file_data);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ success: false, message: 'Error retrieving file' });
    }
});

// Upload sermon media
router.post('/sermons/:id/media', authenticateToken, requireAdmin, [
    body('mediaType').isIn(['video', 'audio', 'notes']).withMessage('Invalid media type'),
    body('mediaData').notEmpty().withMessage('Media data is required'),
    body('mimeType').notEmpty().withMessage('MIME type is required'),
    body('fileName').notEmpty().withMessage('File name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { id } = req.params;
        const { mediaType, mediaData, mimeType, fileName } = req.body;

        // Check if sermon exists
        const [sermonRows] = await pool.execute('SELECT id FROM sermons WHERE id = ?', [id]);
        if (sermonRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Sermon not found' });
        }

        let updateQuery;
        let updateParams;

        switch (mediaType) {
            case 'video':
                updateQuery = 'UPDATE sermons SET video_data = ?, video_type = ?, video_name = ? WHERE id = ?';
                updateParams = [Buffer.from(mediaData, 'base64'), mimeType, fileName, id];
                break;
            case 'audio':
                updateQuery = 'UPDATE sermons SET audio_data = ?, audio_type = ?, audio_name = ? WHERE id = ?';
                updateParams = [Buffer.from(mediaData, 'base64'), mimeType, fileName, id];
                break;
            case 'notes':
                updateQuery = 'UPDATE sermons SET notes_data = ?, notes_type = ?, notes_name = ? WHERE id = ?';
                updateParams = [Buffer.from(mediaData, 'base64'), mimeType, fileName, id];
                break;
        }

        await pool.execute(updateQuery, updateParams);

        res.json({
            success: true,
            message: `${mediaType} uploaded successfully`
        });
    } catch (error) {
        console.error('Error uploading sermon media:', error);
        res.status(500).json({ success: false, message: 'Error uploading sermon media' });
    }
});

// Get sermon media
router.get('/sermons/:id/:mediaType', async (req, res) => {
    try {
        const { id, mediaType } = req.params;
        
        let query, params;
        switch (mediaType) {
            case 'video':
                query = 'SELECT video_data, video_type, video_name FROM sermons WHERE id = ? AND video_data IS NOT NULL';
                break;
            case 'audio':
                query = 'SELECT audio_data, audio_type, audio_name FROM sermons WHERE id = ? AND audio_data IS NOT NULL';
                break;
            case 'notes':
                query = 'SELECT notes_data, notes_type, notes_name FROM sermons WHERE id = ? AND notes_data IS NOT NULL';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid media type' });
        }

        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Media not found' });
        }

        const media = rows[0];
        const dataField = `${mediaType}_data`;
        const typeField = `${mediaType}_type`;
        const nameField = `${mediaType}_name`;

        res.setHeader('Content-Type', media[typeField]);
        res.setHeader('Content-Disposition', `inline; filename="${media[nameField]}"`);
        res.send(media[dataField]);
    } catch (error) {
        console.error('Error retrieving sermon media:', error);
        res.status(500).json({ success: false, message: 'Error retrieving sermon media' });
    }
});

module.exports = router; 