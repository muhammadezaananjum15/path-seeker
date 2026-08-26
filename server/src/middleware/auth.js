import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'pathseeker_super_secret_access_jwt_key_2026_x98123');
    
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'pathseeker_super_secret_access_jwt_key_2026_x98123');
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error for optionalAuth
  }
  next();
};
