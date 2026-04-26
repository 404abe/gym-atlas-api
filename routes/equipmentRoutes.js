const express = require('express');
const router = express.Router();

const equipmentController = require('../controllers/equipmentController');

router.get('/:slug/gyms', equipmentController.getGymsWithEquipment);

module.exports = router;