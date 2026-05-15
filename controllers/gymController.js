const gymService = require('../services/gymService');
const gymRepo = require('../repositories/gymRepository');

const getGyms = async (req, res) => {
	try {
		const gyms = await gymService.getGyms();
		res.json(gyms);
	} catch (err) {
		console.error('GET GYMS ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch gyms' });
	}
};

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

const getGymById = async (req, res) => {
	try {
		const gym = await gymService.getGymById(req.params.id);
		if (!gym) return res.status(404).json({ error: 'Gym not found' });
		res.json(gym);
	} catch (err) {
		console.error('getGymById error:', err); // add this
		res.status(500).json({ error: 'Failed to fetch gym' });
	}
};
const rateGym = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating } = req.body;
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		if (!rating || rating < 1 || rating > 5) {
			return res.status(400).json({ error: 'Rating must be between 1 and 5' });
		}

		const result = await gymService.rateGym(userId, id, rating);
		res.json(result);
	} catch (err) {
		console.error('RATE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to rate gym' });
	}
};

const favouriteGym = async (req, res) => {
	try {
		const gymId = req.params.id;

		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		const result = await gymService.favouriteGym(userId, gymId);

		res.json(result || { message: 'Already favourited' });
	} catch (err) {
		console.error('FAVOURITE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to favourite gym' });
	}
};

const getFavouriteGyms = async (req, res) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		const favouriteGyms = await gymService.getFavouriteGyms(userId);

		res.json({
			success: true,
			count: favouriteGyms.length,
			data: favouriteGyms
		});
	} catch (err) {
		console.error('GET FAVOURITE GYMS ERROR:', err);
		res.status(500).json({ error: 'Failed to get favourites' });
	}
};

const removeFavouriteGym = async (req, res) => {
	try {
		const gymId = req.params.id;

		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		const result = await gymService.removeFavouriteGym(userId, gymId);
		res.json(result || { message: 'Not found' });
	} catch (err) {
		console.error('REMOVE FAVOURITE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove favourite' });
	}
};
const searchGyms = async (req, res) => {
	try {
		const { machines } = req.body;

		const gyms = await gymService.searchGymsByMachines(machines);

		res.json(gyms);
	} catch (err) {
		console.error('SEARCH GYMS ERROR:', err);
		res.status(500).json({ error: 'Failed to search gyms' });
	}
};

module.exports = {
	getGyms,
	getGymById,
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	removeGymEquipment,
	createGym,
	rateGym,
	favouriteGym,
	removeFavouriteGym,
	searchGyms,
	getFavouriteGyms
};
