const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'No token' });

	const token = authHeader.split(' ')[1];
	try {
		req.user = jwt.verify(token, JWT_SECRET);
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
};

// Allows unauthenticated access but attaches user if a valid token is present.
// Used for public endpoints that show richer data when logged in (ratings, favourites etc.)
const optionalAuth = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return next();

	const token = authHeader.split(' ')[1];
	try {
		req.user = jwt.verify(token, JWT_SECRET);
	} catch (err) {
		// Invalid token — ignore and continue as unauthenticated
	}
	next();
};

const adminMiddleware = (req, res, next) => {
	if (!req.user) return res.status(401).json({ error: 'Unauthorised' });
	if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
		return res.status(403).json({ error: 'Forbidden' });
	}
	next();
};

const superAdminMiddleware = (req, res, next) => {
	if (!req.user) return res.status(401).json({ error: 'Unauthorised' });
	if (req.user.role !== 'super_admin') {
		return res.status(403).json({ error: 'Forbidden' });
	}
	next();
};

module.exports = { authMiddleware, optionalAuth, adminMiddleware, superAdminMiddleware };
