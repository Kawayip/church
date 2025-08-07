const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Upload gallery collection
router.post('/gallery/collections', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('category').isIn(['events', 'services', 'outreach', 'youth', 'general']).withMessage('Invalid category'),
    body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
    body('images.*.imageData').notEmpty().withMessage('Image data is required'),
    body('images.*.imageType').notEmpty().withMessage('Image type is required'),
    body('images.*.imageName').notEmpty().withMessage('Image name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, category, images } = req.body;
        const uploadedBy = req.user.id;

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create collection
            const [collectionResult] = await connection.execute(
                'INSERT INTO gallery_collections (title, description, category, uploaded_by) VALUES (?, ?, ?, ?)',
                [title, description, category, uploadedBy]
            );

            const collectionId = collectionResult.insertId;
            let thumbnailImageId = null;

            // Insert images
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const [imageResult] = await connection.execute(
                    'INSERT INTO gallery_images (collection_id, title, description, image_data, image_type, image_name, sort_order, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        collectionId,
                        image.title || null,
                        image.description || null,
                        Buffer.from(image.imageData, 'base64'),
                        image.imageType,
                        image.imageName,
                        i,
                        uploadedBy
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

            res.status(201).json({
                success: true,
                message: 'Collection uploaded successfully',
                id: collectionId,
                imageCount: images.length
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error uploading collection:', error);
        res.status(500).json({ success: false, message: 'Error uploading collection' });
    }
});

// Upload single image to gallery (legacy support)
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

// Get all gallery items (collections and single images)
router.get('/gallery', async (req, res) => {
    try {
        const { category, page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;
        
        // Query for collections
        let collectionsQuery = `
            SELECT 
                gc.id, gc.title, gc.description, gc.category, gc.created_at,
                gc.thumbnail_image_id, gc.updated_at,
                u.first_name, u.last_name,
                COUNT(gi.id) as image_count,
                'collection' as type
            FROM gallery_collections gc
            LEFT JOIN users u ON gc.uploaded_by = u.id
            LEFT JOIN gallery_images gi ON gc.id = gi.collection_id
            WHERE 1=1
        `;
        
        // Query for single images (legacy)
        let singleImagesQuery = `
            SELECT 
                g.id, g.title, g.description, g.category, g.created_at,
                g.id as thumbnail_image_id, g.created_at as updated_at,
                u.first_name, u.last_name,
                1 as image_count,
                'single' as type
            FROM gallery g
            LEFT JOIN users u ON g.uploaded_by = u.id
            WHERE 1=1
        `;
        
        const params = [];
        const singleParams = [];
        
        if (category && category !== 'all') {
            collectionsQuery += ' AND gc.category = ?';
            singleImagesQuery += ' AND g.category = ?';
            params.push(category);
            singleParams.push(category);
        }
        
        if (search) {
            collectionsQuery += ' AND (gc.title LIKE ? OR gc.description LIKE ?)';
            singleImagesQuery += ' AND (g.title LIKE ? OR g.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
            singleParams.push(`%${search}%`, `%${search}%`);
        }
        
        collectionsQuery += ' GROUP BY gc.id ORDER BY gc.created_at DESC';
        singleImagesQuery += ' ORDER BY g.created_at DESC';
        
        // Execute both queries
        const [collections] = await pool.execute(collectionsQuery, params);
        const [singleImages] = await pool.execute(singleImagesQuery, singleParams);
        
        // Combine and sort results
        const allItems = [...collections, ...singleImages].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );
        
        // Apply pagination
        const paginatedItems = allItems.slice(offset, offset + parseInt(limit));
        
        // Get total count
        const total = allItems.length;
        
        res.json({
            success: true,
            data: paginatedItems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({ success: false, message: 'Error fetching gallery items' });
    }
});

// Get collection details with all images
router.get('/gallery/collections/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get collection info
        const [collectionRows] = await pool.execute(`
            SELECT gc.*, u.first_name, u.last_name
            FROM gallery_collections gc
            LEFT JOIN users u ON gc.uploaded_by = u.id
            WHERE gc.id = ?
        `, [id]);
        
        if (collectionRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }
        
        // Get all images in collection
        const [imageRows] = await pool.execute(`
            SELECT id, title, description, image_type, image_name, sort_order, created_at
            FROM gallery_images
            WHERE collection_id = ?
            ORDER BY sort_order ASC
        `, [id]);
        
        const collection = collectionRows[0];
        collection.images = imageRows;
        
        res.json({
            success: true,
            data: collection
        });
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ success: false, message: 'Error fetching collection' });
    }
});

// Get image from gallery (supports both single images and collection images)
router.get('/gallery/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try to get from gallery_images first (collections)
        let [rows] = await pool.execute(
            'SELECT image_data, image_type, image_name FROM gallery_images WHERE id = ?',
            [id]
        );
        
        // If not found, try legacy gallery table
        if (rows.length === 0) {
            [rows] = await pool.execute(
                'SELECT image_data, image_type, image_name FROM gallery WHERE id = ?',
                [id]
            );
        }

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

// Delete gallery item (collection or single image)
router.delete('/gallery/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if it's a collection first
        const [collectionResult] = await pool.execute(
            'DELETE FROM gallery_collections WHERE id = ?',
            [id]
        );
        
        if (collectionResult.affectedRows > 0) {
            // Collection deleted (images will be deleted via CASCADE)
            res.json({ success: true, message: 'Collection deleted successfully' });
            return;
        }
        
        // Try deleting as single image
        const [imageResult] = await pool.execute(
            'DELETE FROM gallery WHERE id = ?',
            [id]
        );
        
        if (imageResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Gallery item not found' });
        }
        
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ success: false, message: 'Error deleting gallery item' });
    }
});

// Update gallery image
router.put('/gallery/:id', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('category').isIn(['events', 'services', 'outreach', 'youth', 'general']).withMessage('Invalid category')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        const { id } = req.params;
        const { title, description, category } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE gallery SET title = ?, description = ?, category = ? WHERE id = ?',
            [title, description, category, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        
        res.json({ success: true, message: 'Image updated successfully' });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ success: false, message: 'Error updating image' });
    }
});

// Upload resource file
router.post('/resources', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('fileType').isIn(['pdf', 'doc', 'video', 'audio', 'image', 'zip']).withMessage('Invalid file type'),
    body('category').isIn(['bulletins', 'sermons', 'study-guides', 'sabbath-school', 'music', 'health', 'youth', 'training', 'other']).withMessage('Invalid category'),
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
            'INSERT INTO resources (title, description, file_data, file_type, file_name, mime_type, file_size, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, Buffer.from(fileData, 'base64'), fileType, fileName, mimeType, fileSize, category]
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
            'SELECT file_data, mime_type, file_name FROM resources WHERE id = ?',
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