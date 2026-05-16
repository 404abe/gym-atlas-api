const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware: auth } = require('../middleware/auth');
require('../middleware/auth');

router.get('/:id/stats', auth, async (req, res) => {
	const userId = req.params.id;
	try {
		const [ratingsRes, gymFavsRes, equipFavsRes, gymsVisitedRes] = await Promise.all([
			pool.query(`SELECT COUNT(*) FROM equipment_ratings WHERE user_id = $1`, [userId]),
			pool.query(`SELECT COUNT(*) FROM gym_favourites WHERE user_id = $1`, [userId]),
			pool.query(`SELECT COUNT(*) FROM equipment_favourites WHERE user_id = $1`, [userId]),
			pool.query(
				`SELECT g.id, g.name, gf.created_at AS visited_at 
                    FROM gym_favourites gf 
                    JOIN gyms g ON g.id = gf.gym_id 
                    WHERE gf.user_id = $1 
                    ORDER BY gf.created_at DESC LIMIT 5`,
				[userId]
			)
		]);
		res.json({
			totalRatings: parseInt(ratingsRes.rows[0].count),
			favouriteGymsCount: parseInt(gymFavsRes.rows[0].count),
			favouriteEquipmentCount: parseInt(equipFavsRes.rows[0].count),
			gymsVisited: gymsVisitedRes.rows.map((g) => ({
				id: g.id,
				name: g.name,
				visitedAt: g.visited_at
			})),
			favouriteMachines: [],
			currentStreak: 0,
			machinesUsedCount: 0,
			memberSince: new Date().toISOString()
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch stats' });
	}
});

module.exports = router;
