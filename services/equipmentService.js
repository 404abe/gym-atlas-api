const equipmentRepo = require('../repositories/equipmentRepository');

const getGymsWithEquipment = async (slug) => {
  const equipment = await equipmentRepo.getEquipmentBySlug(slug);

  if (!equipment) {
    throw new Error('Equipment not found');
  }

  const gyms = await equipmentRepo.getGymsByEquipmentSlug(slug);

  return {
    equipment,
    gyms,
  };
};

module.exports = {
  getGymsWithEquipment,
};