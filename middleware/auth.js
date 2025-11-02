const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'No token, authorization denied' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token format is invalid' });

    try {
        const decodes = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodes.id };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}