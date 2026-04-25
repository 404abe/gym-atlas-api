const gymRepo = require('../repositories/gymRepository');

const getGymEquipment = async (gymId) => {
  const equipment = await gymRepo.getGymEquipment(gymId);

  return equipment;
};

const getGymStats = async () => {
    return await gymRepo.getGymStats();
}
 
const addGymEquipment = async (gymId, equipmentId, count, notes) => {
  return await gymRepo.addGymEquipment(
    gymId,
    equipmentId,
    count,
    notes
  );
};

module.exports = {
  getGymEquipment,
  addGymEquipment,
  getGymStats
};