const supabase = require('../config/supabase');
const pool = require('../db');

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'No token' });

	const token = authHeader.split(' ')[1];
	const { data: { user }, error } = await supabase.auth.getUser(token);
	if (error || !user) return res.status(401).json({ error: 'Invalid token' });

	const { rows } = await pool.query(
		'SELECT username, role FROM profiles WHERE id = $1',
		[user.id]
	);

	req.user = {
		id: user.id,
		email: user.email,
		username: rows[0]?.username ?? '',
		role: rows[0]?.role ?? 'user'
	};

	next();
};

const optionalAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return next();

	const token = authHeader.split(' ')[1];
	const { data: { user }, error } = await supabase.auth.getUser(token);

	if (!error && user) {
		const { rows } = await pool.query(
			'SELECT username, role FROM profiles WHERE id = $1',
			[user.id]
		);
		req.user = {
			id: user.id,
			email: user.email,
			username: rows[0]?.username ?? '',
			role: rows[0]?.role ?? 'user'
		};
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
