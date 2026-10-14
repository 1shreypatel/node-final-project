const jwt = require('jsonwebtoken');
const User = require('../model/user/userModel');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
        }

const token = authHeader.split(' ')[1];

const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sports_academy_secret_key_2026');

const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User Account Not Found.' });
        }

if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Account is Inactive. Please contact Admin.' });
        }

req.user = user;
        next();

    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ message: 'Invalid or Expired Token.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden. Role '${req.user ? req.user.role : 'Guest'}' is not allowed to access this resource.` 
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
