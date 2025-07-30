const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, username, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Middleware to check if user is member or admin
const requireMember = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'member') {
    return res.status(403).json({ 
      success: false, 
      message: 'Member access required' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireMember
}; 