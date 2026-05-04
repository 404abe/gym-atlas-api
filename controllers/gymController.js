const gymService = require('../services/gymService');
const gymRepo = require('../repositories/gymRepository');

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

// POST gym
const createGym = async (req, res) => {
	try {
		const { name, latitude, longitude } = req.body;
		const gym = await gymService.createGym(name, latitude, longitude);
		res.json({
			success: true,
			data: gym
		});
	} catch (err) {
		console.error('CREATE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to create gym' });
	}
};

// POST /gyms/:gymId/equipment
const addGymEquipment = async (req, res) => {
	try {
		const { gymId } = req.params;
		const { equipment_id, quantity, notes } = req.body;

		const result = await gymService.addGymEquipment(gymId, equipment_id, quantity, notes);

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

		res.json({ data: stats });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'failed to fetch gym stats' });
	}
};

// DELETE /gyms/:gymId/equipment/:equipmentId
const removeGymEquipment = async (req, res) => {
	try {
		const { gymId, equipmentId } = req.params;

		const result = await gymService.removeGymEquipment(Number(gymId), Number(equipmentId));

		if (!result) {
			return res.status(404).json({
				success: false,
				error: 'Equipment not found in gym'
			});
		}

		const equipment = await gymRepo.getEquipmentById(result.row.equipment_id);

		const name = equipment
			? `${equipment.brand} ${equipment.series ?? ''} ${equipment.name}`.trim()
			: 'Equipment';

		return res.json({
			success: true,
			action: result.action,
			message:
				result.action === 'decremented' ? `${name} quantity decreased` : `${name} removed from gym`,
			data: result.row
		});
	} catch (err) {
		console.error('DELETE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove equipment' });
	}
};

const rateGym = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id, rating } = req.body;
		const result = await gymService.rateGym(user_id, id, rating);
		res.json(result);
	} catch (err) {
		console.error('RATE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to rate gym' });
	}
};

const favouriteGym = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;
		const result = await gymService.favouriteGym(user_id, id);
		res.json(result || { message: 'Already favourited' });
	} catch (err) {
		console.error('FAVOURITE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to favourite gym' });
	}
};

const removeFavouriteGym = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;
		const result = await gymService.removeFavouriteGym(user_id, id);
		res.json(result || { message: 'Not found' });
	} catch (err) {
		console.error('REMOVE FAVOURITE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove favourite' });
	}
};

module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	removeGymEquipment,
	createGym,
	rateGym,
	favouriteGym,
	removeFavouriteGym
};
