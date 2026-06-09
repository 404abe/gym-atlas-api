const equipmentService = require('../services/equipmentService');
const pool = require('../db');
const { createNotification } = require('../routes/notificationsRoutes');

const getAllEquipment = async (req, res) => {
	try {
		const userId = req.user?.id || null;
		const equipment = await equipmentService.getAllEquipment(userId);
		res.json({ data: equipment });
	} catch (err) {
		console.error('GET ALL EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch equipment' });
	}
};

const getEquipmentById = async (req, res) => {
	try {
		const userId = req.user?.id || null;
		const equipment = await equipmentService.getEquipmentById(req.params.id, userId);
		res.json({ data: equipment });
	} catch (err) {
		if (err.message === 'Equipment not found') {
			return res.status(404).json({ error: err.message });
		}
		console.error('GET EQUIPMENT BY ID ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch equipment' });
	}
};

const createEquipment = async (req, res) => {
	try {
		const { brand, series, name, type, resistance_profile } = req.body;
		const createdBy = req.user?.id || null;
		const equipment = await equipmentService.createEquipment(brand, series, name, type, createdBy, resistance_profile);
		if (createdBy) {
			try {
				await createNotification(pool, createdBy, 'submission_received', equipment.id, 'Your equipment submission is under review');
			} catch (notifyErr) {
				console.error('EQUIPMENT NOTIFICATION ERROR:', notifyErr);
			}
		}
		res.status(201).json({ data: equipment });
	} catch (err) {
		if (err.message === 'brand and name are required') {
			return res.status(400).json({ error: err.message });
		}
		console.error('CREATE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to create equipment' });
	}
};

const getGymsWithEquipment = async (req, res) => {
	try {
		const data = await equipmentService.getGymsWithEquipment(req.params.slug);
		res.json({ data });
	} catch (err) {
		if (err.message === 'Equipment not found') {
			return res.status(404).json({ error: err.message });
		}
		console.error('GET GYMS WITH EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch gyms for equipment' });
	}
};

const searchEquipment = async (req, res) => {
	try {
		const results = await equipmentService.searchEquipment(req.query.query);
		res.json({ data: results });
	} catch (err) {
		console.error('SEARCH EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to search equipment' });
	}
};

const getBrands = async (req, res) => {
	try {
		const brands = await equipmentService.getBrands();
		res.json({ data: brands });
	} catch (err) {
		console.error('GET BRANDS ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch brands' });
	}
};

const getSeriesByBrand = async (req, res) => {
	try {
		const series = await equipmentService.getSeriesByBrand(req.query.brand);
		res.json({ data: series });
	} catch (err) {
		if (err.message === 'brand is required') {
			return res.status(400).json({ error: err.message });
		}
		console.error('GET SERIES ERROR:', err);
		res.status(500).json({ error: 'Failed to fetch series' });
	}
};

const uploadEquipmentImage = async (req, res) => {
	try {
		const userId = req.user?.id || null;
		const image_url = await equipmentService.uploadEquipmentImage(req.params.id, req.file?.buffer, req.file?.mimetype, userId);
		res.json({ data: { image_url } });
	} catch (err) {
		if (err.message === 'No image provided') {
			return res.status(400).json({ error: err.message });
		}
		console.error('IMAGE UPLOAD ERROR:', err);
		res.status(500).json({ error: 'Failed to upload image' });
	}
};

const rateEquipment = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: 'No user found' });
		const result = await equipmentService.rateEquipment(userId, req.params.id, req.body.rating);
		res.json({ data: result });
	} catch (err) {
		if (err.message === 'Rating must be between 1 and 5') {
			return res.status(400).json({ error: err.message });
		}
		console.error('RATE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to rate equipment' });
	}
};

const favouriteEquipment = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: 'No user found' });
		const result = await equipmentService.favouriteEquipment(userId, req.params.id);
		res.json({ data: result });
	} catch (err) {
		console.error('FAVOURITE EQUIPMENT ERROR:', err);
		res.status(500).json({ error: 'Failed to favourite equipment' });
	}
};

const removeFavouriteEquipment = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: 'No user found' });
		const result = await equipmentService.removeFavouriteEquipment(userId, req.params.id);
		res.json({ data: result });
	} catch (err) {
		console.error('REMOVE FAVOURITE ERROR:', err);
		res.status(500).json({ error: 'Failed to remove favourite' });
	}
};

const updateWeightStack = async (req, res) => {
	try {
		const { weight_stack } = req.body;
		const value = weight_stack === null ? null : parseInt(weight_stack, 10);
		if (value !== null && (isNaN(value) || value <= 0)) {
			return res.status(400).json({ error: 'Invalid weight stack value' });
		}
		const result = await equipmentService.updateWeightStack(req.params.id, value);
		if (!result) return res.status(404).json({ error: 'Equipment not found or not pin loaded' });
		res.json({ data: result });
	} catch (err) {
		console.error('UPDATE WEIGHT STACK ERROR:', err);
		res.status(500).json({ error: 'Failed to update weight stack' });
	}
};

module.exports = {
	getAllEquipment,
	getEquipmentById,
	createEquipment,
	getGymsWithEquipment,
	searchEquipment,
	getBrands,
	getSeriesByBrand,
	uploadEquipmentImage,
	rateEquipment,
	favouriteEquipment,
	removeFavouriteEquipment,
	updateWeightStack
};
