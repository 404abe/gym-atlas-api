const express = require('express');
const router = express.Router();

const gymController = require('../controllers/gymController');
const { authMiddleware: auth } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
require('../middleware/auth');

router.get('/', optionalAuth, gymController.getGyms);
router.get('/stats', gymController.getGymStats);
router.get('/:id/equipment', gymController.getGymEquipment);
router.post('/:gymId/equipment', gymController.addGymEquipment);
router.delete('/:gymId/equipment/:equipmentId', gymController.removeGymEquipment);

router.post('/', gymController.createGym);
router.post('/:id/rate', auth, gymController.rateGym);
router.post('/:id/favourite', auth, gymController.favouriteGym);
router.delete('/:id/favourite', auth, gymController.removeFavouriteGym);
router.post('/search', gymController.searchGyms);

router.post('/:id/favourite', auth, gymController.favouriteGym);
router.post('/:id/rate', auth, gymController.rateGym);

router.get('/favourites', auth, gymController.getFavouriteGyms);

router.get('/:id', gymController.getGymById);

module.exports = router;
