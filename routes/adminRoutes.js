const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require('../middleware/auth');

const notify = (userId, type, message, relatedId) =>
	pool.query(
		`INSERT INTO notifications (user_id, type, message, related_id) VALUES ($1, $2, $3, $4)`,
		[userId, type, message, relatedId]
	);

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET /admin/users — super_admin only
router.get('/users', superAdminMiddleware, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT id, email, role, created_at FROM users ORDER BY created_at DESC`
		);
		res.json({ data: result.rows });
	} catch (err) {
		console.error('GET USERS ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

// GET /admin/pending — all pending submissions
router.get('/pending', async (req, res) => {
	try {
		const gyms = await pool.query(
			`SELECT g.*, u.email AS submitted_by    
             FROM gyms g
             LEFT JOIN users u ON u.id = g.created_by
             WHERE g.status = 'pending'
             ORDER BY g.created_at DESC`
		);
		const equipment = await pool.query(
			`SELECT e.*, u.email AS submitted_by
             FROM equipment e
             LEFT JOIN users u ON u.id = e.created_by
             WHERE e.status = 'pending'
             ORDER BY e.created_at DESC`
		);
		const suggestions = await pool.query(
			`SELECT ge.*, 
                g.name AS gym_name,
                CONCAT(e.brand, ' ', e.name) AS equipment_name,
                u.email AS submitted_by
             FROM gym_equipment ge
             JOIN gyms g ON g.id = ge.gym_id
             JOIN equipment e ON e.id = ge.equipment_id
             LEFT JOIN users u ON u.id = ge.created_by
             WHERE ge.status = 'pending'
             ORDER BY ge.created_at DESC`
		);
		res.json({ data: { gyms: gyms.rows, equipment: equipment.rows, suggestions: suggestions.rows } });
	} catch (err) {
		console.error('GET PENDING ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch pending submissions' });
	}
});

// POST /admin/approve/gym/:id
router.post('/approve/gym/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE gyms SET status = 'approved' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Gym not found' });

		const gym = result.rows[0];
		if (gym.created_by) {
			await notify(gym.created_by, 'gym_approved', `Your gym "${gym.name}" was approved!`, gym.id);
		}
		res.json({ data: gym });
	} catch (err) {
		console.error('APPROVE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to approve gym' });
	}
});

// POST /admin/reject/gym/:id
router.post('/reject/gym/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE gyms SET status = 'rejected' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Gym not found' });
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error('REJECT GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to reject gym' });
	}
});

// POST /admin/approve/suggestion/:id
router.post('/approve/suggestion/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE gym_equipment SET status = 'approved' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Suggestion not found' });

		const sugg = result.rows[0];
		if (sugg.created_by) {
			await notify(
				sugg.created_by,
				'suggestion_approved',
				`Your equipment suggestion was approved!`,
				sugg.id
			);
		}
		res.json({ data: sugg });
	} catch (err) {
		console.error('APPROVE SUGGESTION ERROR:', err);
		res.status(500).json({ error: 'Failed to approve suggestion' });
	}
});

// POST /admin/reject/suggestion/:id
router.post('/reject/suggestion/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE gym_equipment SET status = 'rejected' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Suggestion not found' });
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error('REJECT SUGGESTION ERROR:', err);
		res.status(500).json({ error: 'Failed to reject suggestion' });
	}
});

// POST /admin/approve/equipment/:id
router.post('/approve/equipment/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE equipment SET status = 'approved' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Equipment not found' });

		const eq = result.rows[0];
		if (eq.created_by) {
			await notify(
				eq.created_by,
				'equipment_approved',
				`Your equipment "${eq.brand} ${eq.name}" was approved!`,
				eq.id
			);
		}
		res.json({ data: eq });
	} catch (err) {
		console.error('APPROVE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to approve equipment' });
	}
});

// POST /admin/reject/equipment/:id
router.post('/reject/equipment/:id', async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE equipment SET status = 'rejected' WHERE id = $1 RETURNING *`,
			[req.params.id]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'Equipment not found' });
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error('REJECT EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to reject equipment' });
	}
});

// POST /admin/make-admin/:userId — super_admin only
router.post('/make-admin/:userId', superAdminMiddleware, async (req, res) => {
	try {
		const result = await pool.query(
			`UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id, email, role`,
			[req.params.userId]
		);
		if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
		res.json({ data: result.rows[0] });
	} catch (err) {
		console.error('MAKE ADMIN ERROR:', err);
		res.status(500).json({ error: 'Failed to update role' });
	}
});

module.exports = router;
