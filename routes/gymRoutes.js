const express = require('express');
const router = express.Router();

const gymController = require('../controllers/gymController');

router.get('/stats', gymController.getGymStats);
router.get('/:id/equipment', gymController.getGymEquipment);
router.post('/:gymId/equipment', gymController.addGymEquipment);
router.delete('/:gymId/equipment/:equipmentId', gymController.removeGymEquipment);
// POST /gyms

router.post('/', gymController.createGym);
router.post('/:id/rate', gymController.rateGym);
router.post('/:id/favourite', gymController.favouriteGym);
router.delete('/:id/favourite', gymController.removeFavouriteGym);

module.exports = router;
