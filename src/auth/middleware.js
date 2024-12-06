const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        console.error('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = decoded;

        
        if (!req.user.role) {
            console.error('Role not found in token');
            return res.status(403).json({ message: 'Role not found in token' });
        }

        if (req.user.role !== 'admin') {
            console.error('Access denied. Not an admin.');
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        console.log('User is admin, proceeding...');
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};