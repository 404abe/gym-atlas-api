const gymService = require('../services/gymService');

// GET /gyms/:id/equipment
const getGymEquipment = async (req, res) => {
	try {
		const gymId = req.params.id;

		const data = await gymService.getGymEquipment(gymId);

		res.json({
			gym_id: gymId,
			equipment: data
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch gym equipment' });
	}
};

// POST /gyms/:gymId/equipment
const addGymEquipment = async (req, res) => {
	try {
		const { gymId } = req.params;
		const { equipment_id, quantity, notes } = req.body;

		const result = await gymService.addGymEquipment(
			gymId,
			equipment_id,
			quantity,
			notes
		);

		res.json({
			success: true,
			data: result
		});
	} catch (err) {
		console.error('POST ERROR:', err);
		res.status(500).json({ error: 'Failed to add gym equipment' });
	}
};

// GET /gyms/stats
const getGymStats = async (req, res) => {
	try {
		const stats = await gymService.getGymStats();

		res.json({
			data: stats
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'failed to fetch gym stats' });
	}
};

module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats
};