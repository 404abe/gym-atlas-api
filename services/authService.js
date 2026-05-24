const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (email, password, username) => {
	if (!email || !password || !username) {
		throw new Error('Email, password, and username required');
	}

	if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
		throw new Error('Username must be 3-20 characters (letters, numbers, underscores only)');
	}

	const hashed = await bcrypt.hash(password, 10);

	const result = await pool.query(
		`INSERT INTO users (email, password_hash, username)
		VALUES ($1, $2, $3)
		RETURNING id, email, username`,
		[email, hashed, username]
	);

	return result.rows[0];
};

const login = async (email, password) => {
	const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
	const user = result.rows[0];

	if (!user) throw new Error('Invalid credentials');

	const valid = await bcrypt.compare(password, user.password_hash);
	if (!valid) throw new Error('Invalid credentials');

	const token = jwt.sign(
		{ id: user.id, email: user.email, username: user.username, role: user.role },
		JWT_SECRET,
		{ expiresIn: '7d' }
	);

	return { token };
};

module.exports = { register, login };