const express = require('express');
const router = express.Router();

const gymController = require('../controllers/gymController');

router.get('/stats', gymController.getGymStats);
router.get('/:id/equipment', gymController.getGymEquipment);
router.post('/:gymId/equipment', gymController.addGymEquipment);

module.exports = router;
