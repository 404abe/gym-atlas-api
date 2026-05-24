const authService = require('../services/authService');

const register = async (req, res) => {
	try {
		const { email, password, username } = req.body;
		const user = await authService.register(email, password, username);
		res.status(201).json(user);
	} catch (err) {
		if (
			err.message === 'Email, password, and username required' ||
			err.message === 'Username must be 3-20 characters (letters, numbers, underscores only)'
		) {
			return res.status(400).json({ error: err.message });
		}
		// Postgres unique constraint violations
		if (err.code === '23505') {
			if (err.constraint === 'users_username_key') {
				return res.status(400).json({ error: 'Username already taken' });
			}
			if (err.constraint === 'users_email_key') {
				return res.status(400).json({ error: 'Email already registered' });
			}
		}
		console.error('REGISTER ERROR:', err);
		res.status(500).json({ error: 'Register failed' });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const result = await authService.login(email, password);
		res.json(result);
	} catch (err) {
		if (err.message === 'Invalid credentials') {
			return res.status(401).json({ error: err.message });
		}
		console.error('LOGIN ERROR:', err);
		res.status(500).json({ error: 'Login failed' });
	}
};

module.exports = { register, login };
