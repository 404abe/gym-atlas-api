const gymRepo = require('../repositories/gymRepository');

const getGyms = async (userId = null) => {
	return await gymRepo.getGyms(userId);
};

const getGymById = async (id, userId = null) => {
	const gym = await gymRepo.getGymById(id, userId);
	if (!gym) throw new Error('Gym not found');
	return gym;
};

const createGym = async (
	name,
	latitude,
	longitude,
	address,
	city,
	country,
	instagram,
	createdBy = null
) => {
	if (!name) throw new Error('Name is required');
	return await gymRepo.createGym(
		name,
		latitude,
		longitude,
		address,
		city,
		country,
		instagram,
		createdBy
	);
};

const getGymEquipment = async (gymId) => {
	return await gymRepo.getGymEquipment(gymId);
};

const addGymEquipment = async (gymId, equipmentId, quantity, notes, status, createdBy) => {
	return await gymRepo.addGymEquipment(gymId, equipmentId, quantity, notes, status, createdBy);
};

const getGymStats = async () => {
	return await gymRepo.getGymStats();
};

// Decrement quantity if > 1, otherwise delete the row entirely
const removeGymEquipment = async (gymId, equipmentId) => {
	const dec = await gymRepo.decrementGymEquipment(gymId, equipmentId);
	if (dec) return { row: dec, action: 'decremented' };

	const del = await gymRepo.deleteGymEquipment(gymId, equipmentId);
	if (del) return { row: del, action: 'deleted' };

	return null;
};

const rateGym = async (userId, gymId, rating) => {
	if (!rating || rating < 1 || rating > 5) {
		throw new Error('Rating must be between 1 and 5');
	}
	return await gymRepo.rateGym(userId, gymId, rating);
};

const favouriteGym = async (userId, gymId) => {
	return await gymRepo.favouriteGym(userId, gymId);
};

const removeFavouriteGym = async (userId, gymId) => {
	return await gymRepo.removeFavouriteGym(userId, gymId);
};

const getFavouriteGyms = async (userId) => {
	return await gymRepo.getFavouriteGyms(userId);
};

const searchGymsByMachines = async (filters) => {
	if (!filters || filters.length === 0) return await gymRepo.getGyms();
	return await gymRepo.searchGymsByMachines(filters);
};

const getEquipmentById = async (id) => {
	return await gymRepo.getEquipmentById(id);
};

module.exports = {
	getGyms,
	getGymById,
	createGym,
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	removeGymEquipment,
	rateGym,
	favouriteGym,
	removeFavouriteGym,
	getFavouriteGyms,
	searchGymsByMachines,
	getEquipmentById
};
