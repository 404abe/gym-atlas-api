const express = require('express');
const router = express.Router();

const pool = require('../db');
const equipmentController = require('../controllers/equipmentController');
const auth = require('../middleware/auth');

// GET /equipment
router.get('/', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM equipment');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch equipment' });
	}
});

// GET /equipment/:slug/gyms
router.get('/:slug/gyms', equipmentController.getGymsWithEquipment);

// POST /equipment
router.post('/', equipmentController.createEquipment);
router.post('/:id/rate', auth, equipmentController.rateEquipment);
router.post('/:id/favourite', auth, equipmentController.favouriteEquipment);
router.delete('/:id/favourite', auth, equipmentController.removeFavouriteEquipment);
router.get('/search', equipmentController.searchEquipment);

module.exports = router;
