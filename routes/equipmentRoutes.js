const express = require('express');
const router = express.Router();
const pool = require('../db');
const equipmentController = require('../controllers/equipmentController');
const equipmentRepository = require('../repositories/equipmentRepository');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// GET /equipment
router.get('/', optionalAuth, async (req, res) => {
	console.log('user from token:', req.user);
	const userId = req.user?.id || null;
	console.log('userId passed to query:', userId);
	const equipment = await equipmentRepository.getAllEquipment(userId);
	res.json(equipment);
});

//  routes BEFORE /:id
router.get('/search', equipmentController.searchEquipment);
router.get('/:slug/gyms', equipmentController.getGymsWithEquipment);

// POST /equipment
router.post('/', equipmentController.createEquipment);
router.post('/:id/rate', authMiddleware, equipmentController.rateEquipment);
router.post('/:id/favourite', authMiddleware, equipmentController.favouriteEquipment);
router.delete('/:id/favourite', authMiddleware, equipmentController.removeFavouriteEquipment);

// GET /equipment/:id — must be last
router.get('/:id', optionalAuth, equipmentController.getEquipmentById);

module.exports = router;
