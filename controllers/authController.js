const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // move to env later

// ================= REGISTER =================
const register = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password required' });
		}

		const hashed = await bcrypt.hash(password, 10);

		const result = await pool.query(
			`
			INSERT INTO users (email, password_hash)
			VALUES ($1, $2)
			RETURNING id, email
			`,
			[email, hashed]
		);

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Register failed' });
	}
};

// ================= LOGIN =================
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const result = await pool.query(
			`SELECT * FROM users WHERE email = $1`,
			[email]
		);

		const user = result.rows[0];

		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		const valid = await bcrypt.compare(password, user.password_hash);

		if (!valid) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		res.json({ token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Login failed' });
	}
};

module.exports = { register, login };