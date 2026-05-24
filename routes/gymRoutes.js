const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const { authMiddleware: auth, authMiddleware } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
const pool = require('../db');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', optionalAuth, gymController.getGyms);
router.get('/stats', gymController.getGymStats);
router.get('/favourites', auth, gymController.getFavouriteGyms);
router.get('/:id/equipment', gymController.getGymEquipment);

router.post('/', authMiddleware, gymController.createGym);
router.post('/search', gymController.searchGyms);
router.post('/:gymId/equipment', auth, gymController.addGymEquipment);
router.post('/:id/rate', auth, gymController.rateGym);
router.post('/:id/favourite', auth, gymController.favouriteGym);
router.post('/:id/image', authMiddleware, upload.single('image'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ error: 'No image provided' });
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: 'gym-atlas/gyms', resource_type: 'image' }, (error, result) => {
					if (error) reject(error);
					else resolve(result);
				})
				.end(req.file.buffer);
		});
		await pool.query('UPDATE gyms SET image_url = $1 WHERE id = $2', [
			result.secure_url,
			req.params.id
		]);
		res.json({ image_url: result.secure_url });
	} catch (err) {
		console.error('IMAGE UPLOAD ERROR:', err);
		res.status(500).json({ error: 'Failed to upload image' });
	}
});

router.delete('/:gymId/equipment/:equipmentId', gymController.removeGymEquipment);
router.delete('/:id/favourite', auth, gymController.removeFavouriteGym);

router.get('/:id', gymController.getGymById);

module.exports = router;
