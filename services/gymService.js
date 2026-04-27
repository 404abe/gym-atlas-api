const gymRepo = require('../repositories/gymRepository');

const getGymEquipment = async (gymId) => {
	const equipment = await gymRepo.getGymEquipment(gymId);

	return equipment;
};

const getGymStats = async () => {
	return await gymRepo.getGymStats();
};

const addGymEquipment = async (gymId, equipmentId, quantity, notes) => {
	return await gymRepo.addGymEquipment(
		gymId,
		equipmentId,
		quantity,
		notes
	);
};

module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats
};
