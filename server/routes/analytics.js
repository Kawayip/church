const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../database/connection');

// Analytics service class
class AnalyticsService {
  constructor() {
    this.pool = pool;
  }

  // Parse user agent to get device info
  parseUserAgent(userAgent) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    let deviceType = 'desktop';
    if (result.device.type === 'mobile') {
      deviceType = 'mobile';
    } else if (result.device.type === 'tablet') {
      deviceType = 'tablet';
    }

    return {
      deviceType,
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      screenResolution: null // Will be set by frontend
    };
  }

  // Get location from IP address
  getLocationFromIP(ip) {
    try {
      const geo = geoip.lookup(ip);
      return {
        country: geo?.country || 'Unknown',
        city: geo?.city || 'Unknown'
      };
    } catch (error) {
      return {
        country: 'Unknown',
        city: 'Unknown'
      };
    }
  }

  // Track page view
  async trackPageView(data) {
    const connection = await this.pool.getConnection();
    try {
      const {
        sessionId,
        pagePath,
        pageTitle,
        referrer,
        userAgent,
        ipAddress,
        screenResolution,
        timeOnPage = 0
      } = data;

      const deviceInfo = this.parseUserAgent(userAgent);
      const location = this.getLocationFromIP(ipAddress);

      const query = `
        INSERT INTO page_views (
          session_id, page_path, page_title, referrer, user_agent, 
          ip_address, country, city, device_type, browser, os, 
          screen_resolution, time_on_page
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        sessionId,
        pagePath,
        pageTitle,
        referrer,
        userAgent,
        ipAddress,
        location.country,
        location.city,
        deviceInfo.deviceType,
        deviceInfo.browser,
        deviceInfo.os,
        screenResolution,
        timeOnPage
      ];

      await connection.execute(query, values);

      // Update page stats
      await this.updatePageStats(pagePath, pageTitle);

      return { success: true };
    } catch (error) {
      console.error('Error tracking page view:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Start or update session
  async trackSession(data) {
    const connection = await this.pool.getConnection();
    try {
      const {
        sessionId,
        userId = null,
        userAgent,
        ipAddress,
        referrer,
        landingPage,
        screenResolution
      } = data;

      const deviceInfo = this.parseUserAgent(userAgent);
      const location = this.getLocationFromIP(ipAddress);

      // Check if session exists
      const [existingSession] = await connection.execute(
        'SELECT * FROM sessions WHERE id = ?',
        [sessionId]
      );

      if (existingSession.length === 0) {
        // Create new session
        const query = `
          INSERT INTO sessions (
            id, user_id, ip_address, user_agent, country, city,
            device_type, browser, os, screen_resolution, referrer, landing_page
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          sessionId,
          userId,
          ipAddress,
          userAgent,
          location.country,
          location.city,
          deviceInfo.deviceType,
          deviceInfo.browser,
          deviceInfo.os,
          screenResolution,
          referrer,
          landingPage
        ];

        await connection.execute(query, values);

        // Add to active users
        await this.updateActiveUsers(sessionId, landingPage, userAgent, ipAddress);
      } else {
        // Update existing session
        await connection.execute(
          'UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [sessionId]
        );

        // Update active users
        await this.updateActiveUsers(sessionId, landingPage, userAgent, ipAddress);
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking session:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // End session
  async endSession(sessionId, exitPage) {
    const connection = await this.pool.getConnection();
    try {
      const [session] = await connection.execute(
        'SELECT * FROM sessions WHERE id = ?',
        [sessionId]
      );

      if (session.length > 0) {
        const sessionData = session[0];
        
        // Calculate session duration
        const startTime = new Date(sessionData.start_time);
        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000);

        // Get page count for this session
        const [pageViews] = await connection.execute(
          'SELECT COUNT(*) as count FROM page_views WHERE session_id = ?',
          [sessionId]
        );

        const pageCount = pageViews[0].count;
        const isBounce = pageCount <= 1;

        // Update session
        await connection.execute(
          `UPDATE sessions SET 
           end_time = ?, duration = ?, page_count = ?, is_bounce = ?, exit_page = ?
           WHERE id = ?`,
          [endTime, duration, pageCount, isBounce, exitPage, sessionId]
        );

        // Remove from active users
        await connection.execute(
          'DELETE FROM active_users WHERE session_id = ?',
          [sessionId]
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update active users
  async updateActiveUsers(sessionId, pagePath, userAgent, ipAddress) {
    const connection = await this.pool.getConnection();
    try {
      // Remove old entry if exists
      await connection.execute(
        'DELETE FROM active_users WHERE session_id = ?',
        [sessionId]
      );

      // Add new entry
      await connection.execute(
        `INSERT INTO active_users (session_id, page_path, user_agent, ip_address)
         VALUES (?, ?, ?, ?)`,
        [sessionId, pagePath, userAgent, ipAddress]
      );

      // Clean up old entries (older than 30 minutes)
      await connection.execute(
        'DELETE FROM active_users WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 MINUTE)'
      );
    } catch (error) {
      console.error('Error updating active users:', error);
    } finally {
      connection.release();
    }
  }

  // Update page statistics
  async updatePageStats(pagePath, pageTitle) {
    const connection = await this.pool.getConnection();
    try {
      // Check if page stats exist
      const [existing] = await connection.execute(
        'SELECT * FROM page_stats WHERE page_path = ?',
        [pagePath]
      );

      if (existing.length === 0) {
        // Create new page stats
        await connection.execute(
          `INSERT INTO page_stats (page_path, page_title, total_views, unique_views)
           VALUES (?, ?, 1, 1)`,
          [pagePath, pageTitle]
        );
      } else {
        // Update existing page stats
        await connection.execute(
          `UPDATE page_stats SET 
           total_views = total_views + 1,
           page_title = ?
           WHERE page_path = ?`,
          [pageTitle, pagePath]
        );
      }
    } catch (error) {
      console.error('Error updating page stats:', error);
    } finally {
      connection.release();
    }
  }

  // Get dashboard statistics
  async getDashboardStats(days = 30) {
    const connection = await this.pool.getConnection();
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get total visitors, sessions, and page views
      const [totalStats] = await connection.execute(`
        SELECT 
          COUNT(DISTINCT s.id) as total_sessions,
          COUNT(DISTINCT s.ip_address) as total_visitors,
          COUNT(pv.id) as total_page_views
        FROM sessions s
        LEFT JOIN page_views pv ON s.id = pv.session_id
        WHERE s.start_time >= ?
      `, [startDate]);

      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const [todayStats] = await connection.execute(`
        SELECT 
          COUNT(DISTINCT s.id) as today_sessions,
          COUNT(DISTINCT s.ip_address) as today_visitors,
          COUNT(pv.id) as today_page_views
        FROM sessions s
        LEFT JOIN page_views pv ON s.id = pv.session_id
        WHERE DATE(s.start_time) = ?
      `, [today]);

      // Get active users (last 30 minutes)
      const [activeUsers] = await connection.execute(`
        SELECT COUNT(*) as active_users
        FROM active_users
        WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      `);

      // Get top pages
      const [topPages] = await connection.execute(`
        SELECT page_path, page_title, total_views
        FROM page_stats
        ORDER BY total_views DESC
        LIMIT 10
      `);

      // Get device breakdown
      const [deviceStats] = await connection.execute(`
        SELECT 
          device_type,
          COUNT(*) as count
        FROM sessions
        WHERE start_time >= ?
        GROUP BY device_type
      `, [startDate]);

      // Get daily stats for chart
      const [dailyStats] = await connection.execute(`
        SELECT 
          DATE(start_time) as date,
          COUNT(DISTINCT s.id) as sessions,
          COUNT(DISTINCT s.ip_address) as visitors,
          COUNT(pv.id) as page_views
        FROM sessions s
        LEFT JOIN page_views pv ON s.id = pv.session_id
        WHERE s.start_time >= ?
        GROUP BY DATE(start_time)
        ORDER BY date
      `, [startDate]);

      return {
        total: totalStats[0] || { total_sessions: 0, total_visitors: 0, total_page_views: 0 },
        today: todayStats[0] || { today_sessions: 0, today_visitors: 0, today_page_views: 0 },
        activeUsers: activeUsers[0]?.active_users || 0,
        topPages,
        deviceStats,
        dailyStats
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get detailed analytics
  async getDetailedAnalytics(filters = {}) {
    const connection = await this.pool.getConnection();
    try {
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate = new Date(),
        page = 1,
        limit = 50
      } = filters;

      const offset = (page - 1) * limit;

      // Get sessions with pagination
      const [sessions] = await connection.execute(`
        SELECT 
          s.*,
          COUNT(pv.id) as page_views,
          u.first_name,
          u.last_name,
          u.email
        FROM sessions s
        LEFT JOIN page_views pv ON s.id = pv.session_id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.start_time BETWEEN ? AND ?
        GROUP BY s.id
        ORDER BY s.start_time DESC
        LIMIT ? OFFSET ?
      `, [startDate, endDate, limit, offset]);

      // Get total count
      const [totalCount] = await connection.execute(`
        SELECT COUNT(*) as total
        FROM sessions
        WHERE start_time BETWEEN ? AND ?
      `, [startDate, endDate]);

      return {
        sessions,
        total: totalCount[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalCount[0].total / limit)
      };
    } catch (error) {
      console.error('Error getting detailed analytics:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

const analyticsService = new AnalyticsService();

// Routes

// Track page view
router.post('/track-page-view', async (req, res) => {
  try {
    const result = await analyticsService.trackPageView(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ success: false, message: 'Failed to track page view' });
  }
});

// Track session
router.post('/track-session', async (req, res) => {
  try {
    const result = await analyticsService.trackSession(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error tracking session:', error);
    res.status(500).json({ success: false, message: 'Failed to track session' });
  }
});

// End session
router.post('/end-session', async (req, res) => {
  try {
    const { sessionId, exitPage } = req.body;
    const result = await analyticsService.endSession(sessionId, exitPage);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ success: false, message: 'Failed to end session' });
  }
});

// Get dashboard statistics (admin only)
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await analyticsService.getDashboardStats(parseInt(days));
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to get dashboard stats' });
  }
});

// Get detailed analytics (admin only)
router.get('/detailed', authenticateToken, async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };

    const analytics = await analyticsService.getDetailedAnalytics(filters);
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error getting detailed analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to get detailed analytics' });
  }
});

// Get real-time active users (admin only)
router.get('/active-users', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [activeUsers] = await connection.execute(`
      SELECT 
        session_id,
        page_path,
        ip_address,
        last_activity
      FROM active_users
      WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      ORDER BY last_activity DESC
    `);

    res.json({ success: true, data: activeUsers });
  } catch (error) {
    console.error('Error getting active users:', error);
    res.status(500).json({ success: false, message: 'Failed to get active users' });
  } finally {
    connection.release();
  }
});

module.exports = router;
