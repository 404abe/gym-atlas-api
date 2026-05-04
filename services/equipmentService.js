const equipmentRepo = require('../repositories/equipmentRepository');

const getGymsWithEquipment = async (slug) => {
	const equipment = await equipmentRepo.getEquipmentBySlug(slug);

	if (!equipment) {
		throw new Error('Equipment not found');
	}

	const gyms = await equipmentRepo.getGymsByEquipmentSlug(slug);

	return {
		equipment,
		gyms
	};
};

const rateEquipment = async (userId, equipmentId, rating) => {
	return await equipmentRepo.rateEquipment(userId, equipmentId, rating);
};

const favouriteEquipment = async (userId, equipmentId) => {
	return await equipmentRepo.favouriteEquipment(userId, equipmentId);
};

const removeFavouriteEquipment = async (userId, equipmentId) => {
	return await equipmentRepo.removeFavouriteEquipment(userId, equipmentId);
};

module.exports = {
	getGymsWithEquipment,
	rateEquipment,
	favouriteEquipment,
	removeFavouriteEquipment
};
