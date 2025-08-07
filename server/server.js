const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Import database connection
const { testConnection, initializeDatabase } = require('./database/connection');

// Import routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const sermonsRoutes = require('./routes/sermons');
const ministriesRoutes = require('./routes/ministries');
const contactRoutes = require('./routes/contact');
const filesRoutes = require('./routes/files');
const postsRoutes = require('./routes/posts');
const resourcesRoutes = require('./routes/resources');
const downloadsRoutes = require('./routes/downloads');
const socialRoutes = require('./routes/social');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['https://mtolivesda-production.up.railway.app', 'http://localhost:5173', 'http://localhost:5000', 'https://www.mtolivesdachurch.com', 'https://mtolivesdachurch.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware - Increased to 25MB for large file uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// File routes for BLOB handling
app.use('/api/files', filesRoutes);

// Social media crawler detection middleware
app.use((req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const isSocialCrawler = /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|TelegramBot|Discordbot/i.test(userAgent);
  
  if (isSocialCrawler) {
    // Handle social media crawlers
    const path = req.path;
    
    // Event pages
    if (path.match(/^\/events\/(\d+)$/)) {
      const eventId = path.match(/^\/events\/(\d+)$/)[1];
      return res.redirect(`/api/social/event/${eventId}`);
    }
    
    // Post pages
    if (path.match(/^\/posts\/(\d+)$/)) {
      const postId = path.match(/^\/posts\/(\d+)$/)[1];
      return res.redirect(`/api/social/post/${postId}`);
    }
    
    // General pages
    const pageTypes = ['home', 'about', 'events', 'ministries', 'resources', 'contact'];
    for (const pageType of pageTypes) {
      if (path === `/${pageType}` || (pageType === 'home' && path === '/')) {
        return res.redirect(`/api/social/page/${pageType}`);
      }
    }
  }
  
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/sermons', sermonsRoutes);
app.use('/api/ministries', ministriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/downloads', downloadsRoutes);
app.use('/api/social', socialRoutes);

// Additional API routes for other features
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { pool } = require('./database/connection');
    
    // Get counts for dashboard
    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [eventsCount] = await pool.execute('SELECT COUNT(*) as count FROM events');
    const [sermonsCount] = await pool.execute('SELECT COUNT(*) as count FROM sermons');
    const [ministriesCount] = await pool.execute('SELECT COUNT(*) as count FROM ministries WHERE is_active = true');
    const [unreadMessagesCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false');

    res.json({
      success: true,
      data: {
        users: usersCount[0].count,
        events: eventsCount[0].count,
        sermons: sermonsCount[0].count,
        ministries: ministriesCount[0].count,
        unreadMessages: unreadMessagesCount[0].count
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your MySQL configuration.');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
      console.log('✅ Mt. Olives SDA Church Backend is ready!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer(); 