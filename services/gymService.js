const gymRepo = require('../repositories/gymRepository');

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

module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	removeGymEquipment,
	createGym
};
