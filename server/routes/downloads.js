const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Track a download event
router.post('/track', async (req, res) => {
  try {
    const {
      fileName,
      fileUrl,
      fileType,
      fileSize,
      userAgent,
      ipAddress,
      referrer,
      userId,
      sessionId
    } = req.body;

    const query = `
      INSERT INTO download_tracking (
        file_name, file_url, file_type, file_size, user_agent, 
        ip_address, referrer, user_id, session_id, download_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      fileName,
      fileUrl,
      fileType,
      fileSize || null,
      userAgent,
      ipAddress || req.ip,
      referrer || null,
      userId || null,
      sessionId
    ];

    await db.query(query, values);

    res.json({ success: true, message: 'Download tracked successfully' });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ success: false, message: 'Failed to track download' });
  }
});

// Sync multiple download events (for offline tracking)
router.post('/sync', async (req, res) => {
  try {
    const downloads = req.body;
    
    if (!Array.isArray(downloads) || downloads.length === 0) {
      return res.json({ success: true, message: 'No downloads to sync' });
    }

    const query = `
      INSERT INTO download_tracking (
        file_name, file_url, file_type, file_size, user_agent, 
        ip_address, referrer, user_id, session_id, download_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const download of downloads) {
      const values = [
        download.fileName,
        download.fileUrl,
        download.fileType,
        download.fileSize || null,
        download.userAgent,
        download.ipAddress || req.ip,
        download.referrer || null,
        download.userId || null,
        download.sessionId,
        download.downloadTime
      ];

      await db.query(query, values);
    }

    res.json({ success: true, message: `${downloads.length} downloads synced successfully` });
  } catch (error) {
    console.error('Error syncing downloads:', error);
    res.status(500).json({ success: false, message: 'Failed to sync downloads' });
  }
});

// Get download analytics
router.get('/analytics', async (req, res) => {
  try {
    // Get total downloads
    const totalQuery = 'SELECT COUNT(*) as total FROM download_tracking';
    const [totalResult] = await db.query(totalQuery);
    const totalDownloads = totalResult[0].total;

    // Get downloads by file
    const fileQuery = `
      SELECT file_name, COUNT(*) as count 
      FROM download_tracking 
      GROUP BY file_name 
      ORDER BY count DESC 
      LIMIT 20
    `;
    const fileResults = await db.query(fileQuery);
    const downloadsByFile = {};
    fileResults.forEach(row => {
      downloadsByFile[row.file_name] = row.count;
    });

    // Get downloads by date (last 30 days)
    const dateQuery = `
      SELECT DATE(download_time) as date, COUNT(*) as count 
      FROM download_tracking 
      WHERE download_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(download_time) 
      ORDER BY date DESC
    `;
    const dateResults = await db.query(dateQuery);
    const downloadsByDate = {};
    dateResults.forEach(row => {
      downloadsByDate[row.date] = row.count;
    });

    // Get downloads by type
    const typeQuery = `
      SELECT file_type, COUNT(*) as count 
      FROM download_tracking 
      GROUP BY file_type 
      ORDER BY count DESC
    `;
    const typeResults = await db.query(typeQuery);
    const downloadsByType = {};
    typeResults.forEach(row => {
      downloadsByType[row.file_type] = row.count;
    });

    // Get recent downloads
    const recentQuery = `
      SELECT * FROM download_tracking 
      ORDER BY download_time DESC 
      LIMIT 10
    `;
    const recentDownloads = await db.query(recentQuery);

    res.json({
      success: true,
      data: {
        totalDownloads,
        downloadsByFile,
        downloadsByDate,
        downloadsByType,
        recentDownloads
      }
    });
  } catch (error) {
    console.error('Error fetching download analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

// Get recent downloads
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const query = `
      SELECT * FROM download_tracking 
      ORDER BY download_time DESC 
      LIMIT ?
    `;
    
    const downloads = await db.query(query, [limit]);
    
    res.json({ success: true, data: downloads });
  } catch (error) {
    console.error('Error fetching recent downloads:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent downloads' });
  }
});

// Get download statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    // Today's downloads
    const todayQuery = `
      SELECT COUNT(*) as count 
      FROM download_tracking 
      WHERE DATE(download_time) = CURDATE()
    `;
    const [todayResult] = await db.query(todayQuery);

    // This week's downloads
    const weekQuery = `
      SELECT COUNT(*) as count 
      FROM download_tracking 
      WHERE download_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;
    const [weekResult] = await db.query(weekQuery);

    // This month's downloads
    const monthQuery = `
      SELECT COUNT(*) as count 
      FROM download_tracking 
      WHERE download_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    const [monthResult] = await db.query(monthQuery);

    // Top downloaded files
    const topFilesQuery = `
      SELECT file_name, COUNT(*) as count 
      FROM download_tracking 
      GROUP BY file_name 
      ORDER BY count DESC 
      LIMIT 5
    `;
    const topFiles = await db.query(topFilesQuery);

    res.json({
      success: true,
      data: {
        today: todayResult[0].count,
        thisWeek: weekResult[0].count,
        thisMonth: monthResult[0].count,
        topFiles
      }
    });
  } catch (error) {
    console.error('Error fetching download stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch download stats' });
  }
});

module.exports = router; 