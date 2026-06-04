const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
	try {
		const result = await pool.query(`
            SELECT
                u.id,
                u.username,
                COUNT(DISTINCT g.id) AS gyms_added,
                COUNT(DISTINCT e.id) AS equipment_added,
                COUNT(DISTINCT ge.id) AS equipment_linked,
                COUNT(DISTINCT ep.id) AS photos_added,
                (COUNT(DISTINCT g.id) + COUNT(DISTINCT e.id) + COUNT(DISTINCT ge.id) + COUNT(DISTINCT ep.id)) AS total_contributions
            FROM profiles u
            LEFT JOIN gyms g ON g.created_by = u.id AND g.status = 'approved'
            LEFT JOIN equipment e ON e.created_by = u.id AND e.status = 'approved'
            LEFT JOIN gym_equipment ge ON ge.created_by = u.id AND ge.status = 'approved'
            LEFT JOIN equipment ep ON ep.photo_uploaded_by = u.id AND ep.status = 'approved' AND ep.photo_status = 'approved'
            GROUP BY u.id, u.username
            HAVING COUNT(DISTINCT g.id) + COUNT(DISTINCT e.id) + COUNT(DISTINCT ge.id) + COUNT(DISTINCT ep.id) > 0
            ORDER BY total_contributions DESC
            LIMIT 100
        `);
		res.json({ data: result.rows });
	} catch (err) {
		console.error('LEADERBOARD ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch leaderboard' });
	}
});

// GET /leaderboard/user/:id - get specific user's contributions with details
router.get('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;

		// Get summary stats
		const summary = await pool.query(
			`
            SELECT
                COUNT(DISTINCT g.id) AS gyms_added,
                COUNT(DISTINCT e.id) AS equipment_added,
                COUNT(DISTINCT ge.id) AS equipment_linked,
                COUNT(DISTINCT ep.id) AS photos_added,
                (COUNT(DISTINCT g.id) + COUNT(DISTINCT e.id) + COUNT(DISTINCT ge.id) + COUNT(DISTINCT ep.id)) AS total_contributions
            FROM profiles u
            LEFT JOIN gyms g ON g.created_by = u.id AND g.status = 'approved'
            LEFT JOIN equipment e ON e.created_by = u.id AND e.status = 'approved'
            LEFT JOIN gym_equipment ge ON ge.created_by = u.id AND ge.status = 'approved'
            LEFT JOIN equipment ep ON ep.photo_uploaded_by = u.id AND ep.status = 'approved' AND ep.photo_status = 'approved'
            WHERE u.id = $1
            GROUP BY u.id
        `,
			[id]
		);

		// Get recent contributions with details
		const gyms = await pool.query(
			`
            SELECT id, name, city, country, created_at 
            FROM gyms 
            WHERE created_by = $1 AND status = 'approved'
            ORDER BY created_at DESC 
            LIMIT 5
        `,
			[id]
		);

		const equipment = await pool.query(
			`
            SELECT id, brand, series, name, created_at 
            FROM equipment 
            WHERE created_by = $1 AND status = 'approved'
            ORDER BY created_at DESC 
            LIMIT 5
        `,
			[id]
		);

		const links = await pool.query(
			`
            SELECT
                ge.id,
                ge.created_at,
                g.name AS gym_name,
                CONCAT(e.brand, ' ', e.name) AS equipment_name
            FROM gym_equipment ge
            JOIN gyms g ON g.id = ge.gym_id
            JOIN equipment e ON e.id = ge.equipment_id
            WHERE ge.created_by = $1 AND ge.status = 'approved'
            ORDER BY ge.created_at DESC
            LIMIT 5
        `,
			[id]
		);

		const photos = await pool.query(
			`
            SELECT id, brand, series, name, image_url, photo_uploaded_at AS uploaded_at
            FROM equipment
            WHERE photo_uploaded_by = $1 AND status = 'approved'
            ORDER BY photo_uploaded_at DESC
            LIMIT 5
        `,
			[id]
		);

		res.json({
			data: {
				summary: summary.rows[0] || {
					gyms_added: 0,
					equipment_added: 0,
					equipment_linked: 0,
					photos_added: 0,
					total_contributions: 0
				},
				recent: {
					gyms: gyms.rows,
					equipment: equipment.rows,
					links: links.rows,
					photos: photos.rows
				}
			}
		});
	} catch (err) {
		console.error('USER CONTRIBUTIONS ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch user contributions' });
	}
});

module.exports = router;
