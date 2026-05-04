const equipmentService = require('../services/equipmentService');
const equipmentRepo = require('../repositories/equipmentRepository');

// POST /equipment
const createEquipment = async (req, res) => {
	try {
		const { brand, series, name, type } = req.body;

		if (!brand || !name) {
			return res.status(400).json({
				error: 'brand and name are required'
			});
		}

		const equipment = await equipmentRepo.createEquipment(
			brand,
			series || null,
			name,
			type || null
		);

		res.json({
			success: true,
			data: equipment
		});
	} catch (err) {
		console.error('POST EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to create equipment' });
	}
};

module.exports = {
	createEquipment
};

const getGymsWithEquipment = async (req, res) => {
	try {
		const { slug } = req.params;

		const data = await equipmentService.getGymsWithEquipment(slug);

		res.json({
			equipment: data.equipment,
			gyms: data.gyms
		});
	} catch (err) {
		console.error('FULL ERROR:', err);

		if (err.message === 'Equipment not found') {
			return res.status(404).json({ error: 'Equipment not found' });
		}

		res.status(500).json({ error: 'Failed to fetch gyms for equipment' });
	}
};

const rateEquipment = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id, rating } = req.body;
		const result = await equipmentService.rateEquipment(user_id, id, rating);
		res.json(result);
	} catch (err) {
		console.error('RATE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to rate Equipment' });
	}
};

const favouriteEquipment = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;
		const result = await equipmentService.favouriteEquipment(user_id, id);
		res.json(result || { message: 'Already favourited' });
	} catch (err) {
		console.error('FAVOURITE GYM ERROR:', err);
		res.status(500).json({ error: 'Failed to favourite equipment' });
	}
};

const removeFavouriteEquipment = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;
		const result = await equipmentService.removeFavouriteEquipment(user_id, id);
		res.json(result || { message: 'Not found' });
	} catch (err) {
		console.error('REMOVE FAVOURITE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove favourite' });
	}
};

module.exports = {
	getGymsWithEquipment,
	createEquipment,
	rateEquipment,
	favouriteEquipment,
	removeFavouriteEquipment
};
