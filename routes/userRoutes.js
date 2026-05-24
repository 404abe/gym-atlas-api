const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware: auth } = require('../middleware/auth');

router.get('/:id/stats', auth, async (req, res) => {
	const userId = req.params.id;
	try {
		const [ratingsRes, gymFavsRes, equipFavsRes] = await Promise.all([
			pool.query(`SELECT COUNT(*) FROM equipment_ratings WHERE user_id = $1`, [userId]),
			pool.query(`SELECT COUNT(*) FROM gym_favourites WHERE user_id = $1`, [userId]),
			pool.query(`SELECT COUNT(*) FROM equipment_favourites WHERE user_id = $1`, [userId])
		]);
		res.json({
			totalRatings: parseInt(ratingsRes.rows[0].count),
			favouriteGymsCount: parseInt(gymFavsRes.rows[0].count),
			favouriteEquipmentCount: parseInt(equipFavsRes.rows[0].count)
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch stats' });
	}
});

router.get('/:id/ratings/gyms', auth, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT g.id, g.name, g.city, g.country, gr.rating
			 FROM gym_ratings gr
			 JOIN gyms g ON g.id = gr.gym_id
			 WHERE gr.user_id = $1 AND g.status = 'approved'
			 ORDER BY gr.created_at DESC`,
			[req.params.id]
		);
		res.json({ success: true, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch gym ratings' });
	}
});

router.get('/:id/ratings/equipment', auth, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT e.id, e.name, e.brand, e.series, e.slug, e.image_url, er.rating
			 FROM equipment_ratings er
			 JOIN equipment e ON e.id = er.equipment_id
			 WHERE er.user_id = $1 AND e.status = 'approved'
			 ORDER BY er.created_at DESC`,
			[req.params.id]
		);
		res.json({ success: true, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch equipment ratings' });
	}
});

router.get('/:id/favourites/gyms', auth, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT g.id, g.name, g.city, g.country
			 FROM gym_favourites gf
			 JOIN gyms g ON g.id = gf.gym_id
			 WHERE gf.user_id = $1 AND g.status = 'approved'
			 ORDER BY gf.created_at DESC`,
			[req.params.id]
		);
		res.json({ success: true, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch favourite gyms' });
	}
});

router.get('/:id/favourites/equipment', auth, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT e.id, e.name, e.brand, e.series, e.slug, e.image_url
			 FROM equipment_favourites ef
			 JOIN equipment e ON e.id = ef.equipment_id
			 WHERE ef.user_id = $1 AND e.status = 'approved'
			 ORDER BY ef.created_at DESC`,
			[req.params.id]
		);
		res.json({ success: true, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch favourite equipment' });
	}
});

// /:id must always be last
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT 
				u.username, u.created_at,
				(SELECT COUNT(*) FROM gym_ratings       WHERE user_id = u.id)::int AS gyms_rated,
				(SELECT COUNT(*) FROM equipment_ratings WHERE user_id = u.id)::int AS equipment_rated
			 FROM users u
			 WHERE u.id = $1`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

module.exports = router;
