const supabase = require('../config/supabase');
const pool = require('../db');

const upsertProfile = (user) => {
	const username =
		user.user_metadata?.username ||
		user.email?.split('@')[0] ||
		`user_${user.id.slice(0, 8)}`;
	return pool.query(
		'INSERT INTO profiles (id, email, username) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
		[user.id, user.email, username]
	);
};

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'No token' });

	const token = authHeader.split(' ')[1];
	const { data: { user }, error } = await supabase.auth.getUser(token);
	if (error || !user) return res.status(401).json({ error: 'Invalid token' });

	await upsertProfile(user);

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
		await upsertProfile(user);

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
