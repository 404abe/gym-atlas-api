const gymRepo = require('../repositories/gymRepository');

const getGyms = async (userId = null) => {
	return await gymRepo.getGyms(userId);
};

// POST
const createGym = async (name, latitude, longitude) => {
	if (!name || latitude == null || longitude == null) {
		throw new Error('Missing gym fields');
	}
	return await gymRepo.createGym(name, latitude, longitude);
};

// GET
const getGymEquipment = async (gymId) => {
	return await gymRepo.getGymEquipment(gymId);
};

// ADD
const addGymEquipment = async (gymId, equipmentId, quantity, notes) => {
	return await gymRepo.addGymEquipment(gymId, equipmentId, quantity, notes);
};

// STATS
const getGymStats = async () => {
	return await gymRepo.getGymStats();
};

// REMOVE (decrement OR delete)
const removeGymEquipment = async (gymId, equipmentId) => {
	const dec = await gymRepo.decrementGymEquipment(gymId, equipmentId);

	if (dec) {
		return { row: dec, action: 'decremented' };
	}

	const del = await gymRepo.deleteGymEquipment(gymId, equipmentId);

	if (del) {
		return { row: del, action: 'deleted' };
	}

	return null;
};

const rateGym = async (userId, gymId, rating) => {
	return await gymRepo.rateGym(userId, gymId, rating);
};

const favouriteGym = async (userId, gymId) => {
	return await gymRepo.favouriteGym(userId, gymId);
};

const removeFavouriteGym = async (userId, gymId) => {
	return await gymRepo.removeFavouriteGym(userId, gymId);
};

const searchGymsByMachines = async (filters) => {
	if (!filters || filters.length === 0) {
		return await gymRepo.getGyms();
	}
	return await gymRepo.searchGymsByMachines(filters);
};

const getFavouriteGyms = async (userId) => {
	return await gymRepo.getFavouriteGyms(userId);
};

const getGymById = async (id) => {
	return await gymRepo.getGymById(id);
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
	searchGymsByMachines,
	getFavouriteGyms
};
