const equipmentService = require('../services/equipmentService');
const equipmentRepo = require('../repositories/equipmentRepository');

const getEquipmentById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id || null;
		const equipment = await equipmentRepo.getEquipmentById(id, userId);
		if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
		res.json(equipment);
	} catch (err) {
		console.error('GET EQUIPMENT BY ID ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch equipment' });
	}
};

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

const getGymsWithEquipment = async (req, res) => {
	try {
		const { slug } = req.params;
		console.log('slug:', slug); // add
		const data = await equipmentService.getGymsWithEquipment(slug);
		res.json({ equipment: data.equipment, gyms: data.gyms });
	} catch (err) {
		console.error('FULL ERROR:', err.message, err.stack); // expand this
		if (err.message === 'Equipment not found') {
			return res.status(404).json({ error: 'Equipment not found' });
		}
		res.status(500).json({ error: 'Failed to fetch gyms for equipment' });
	}
};
const rateEquipment = async (req, res) => {
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

		const result = await equipmentService.rateEquipment(userId, id, rating);
		res.json(result);
	} catch (err) {
		console.error('RATE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to rate Equipment' });
	}
};

const favouriteEquipment = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		const result = await equipmentService.favouriteEquipment(userId, id);
		res.json(result || { message: 'Already favourited' });
	} catch (err) {
		console.error('FAVOURITE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to favourite equipment' });
	}
};

const removeFavouriteEquipment = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id; // ✅ Get from auth

		if (!userId) {
			return res.status(401).json({ error: 'No user found' });
		}

		const result = await equipmentService.removeFavouriteEquipment(userId, id);
		res.json(result || { message: 'Not found' });
	} catch (err) {
		console.error('REMOVE FAVOURITE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove favourite' });
	}
};

const searchEquipment = async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.json([]);
		}
		const results = await equipmentRepo.searchEquipmentByName(query);
		res.json(results);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to search equipment' });
	}
};

module.exports = {
	getEquipmentById,
	getGymsWithEquipment,
	createEquipment,
	rateEquipment,
	favouriteEquipment,
	removeFavouriteEquipment,
	searchEquipment
};
