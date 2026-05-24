const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// ── Image upload ──────────────────────────────────────────────────────────────
router.post(
	'/:id/image',
	authMiddleware,
	upload.single('image'),
	equipmentController.uploadEquipmentImage
);

// ── Collection routes ─────────────────────────────────────────────────────────
router.get('/', optionalAuth, equipmentController.getAllEquipment);
router.post('/', authMiddleware, equipmentController.createEquipment);

// ── Specific named routes (must be before /:id) ───────────────────────────────
router.get('/search', equipmentController.searchEquipment);
router.get('/brands', equipmentController.getBrands);
router.get('/series', equipmentController.getSeriesByBrand);
router.get('/:slug/gyms', equipmentController.getGymsWithEquipment);

// ── Interactions ──────────────────────────────────────────────────────────────
router.post('/:id/rate', authMiddleware, equipmentController.rateEquipment);
router.post('/:id/favourite', authMiddleware, equipmentController.favouriteEquipment);
router.delete('/:id/favourite', authMiddleware, equipmentController.removeFavouriteEquipment);

// ── Single resource (must be last) ────────────────────────────────────────────
router.get('/:id', optionalAuth, equipmentController.getEquipmentById);

module.exports = router;
