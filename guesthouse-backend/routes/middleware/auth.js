// File: guesthouse-backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'; 

const protectAdminRoute = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Access denied. No valid token found.' 
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 

        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Forbidden. Admin privileges required.' 
            });
        }

        next(); 

    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid or expired token.' 
        });
    }
};

module.exports = { protectAdminRoute };