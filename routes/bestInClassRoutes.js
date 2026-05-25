const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /best-in-class/categories
router.get('/categories', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM equipment_categories ORDER BY type, name`);
		res.json({ data: result.rows });
	} catch (err) {
		console.error('GET CATEGORIES ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch categories' });
	}
});

// GET /best-in-class/user/:id
router.get('/user/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`
			SELECT 
				ub.id,
				ec.name AS category_name,
				ec.slug AS category_slug,
				ec.type AS category_type,
				e.id AS equipment_id,
				e.brand,
				e.series,
				e.name AS equipment_name,
				e.image_url
			FROM user_best_in_class ub
			JOIN equipment_categories ec ON ec.id = ub.category_id
			JOIN equipment e ON e.id = ub.equipment_id
			WHERE ub.user_id = $1
			ORDER BY ec.type, ec.name
			`,
			[req.params.id]
		);
		res.json({ data: result.rows });
	} catch (err) {
		console.error('GET BEST IN CLASS ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch best in class' });
	}
});

// POST /best-in-class
router.post('/', authMiddleware, async (req, res) => {
	try {
		const { category_id, equipment_id } = req.body;
		const userId = req.user.id;

		const result = await pool.query(
			`
			INSERT INTO user_best_in_class (user_id, category_id, equipment_id)
			VALUES ($1, $2, $3)
			ON CONFLICT (user_id, category_id)
			DO UPDATE SET equipment_id = EXCLUDED.equipment_id
			RETURNING *
			`,
			[userId, category_id, equipment_id]
		);
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error('SET BEST IN CLASS ERROR:', err);
		res.status(500).json({ error: 'Failed to set best in class' });
	}
});

// DELETE /best-in-class/:categoryId
router.delete('/:categoryId', authMiddleware, async (req, res) => {
	try {
		await pool.query(`DELETE FROM user_best_in_class WHERE user_id = $1 AND category_id = $2`, [
			req.user.id,
			req.params.categoryId
		]);
		res.json({ data: null });
	} catch (err) {
		console.error('DELETE BEST IN CLASS ERROR:', err);
		res.status(500).json({ error: 'Failed to remove best in class' });
	}
});

module.exports = router;
