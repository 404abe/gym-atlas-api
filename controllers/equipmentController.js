const equipmentService = require('../services/equipmentService');

const getGymsWithEquipment = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await equipmentService.getGymsWithEquipment(slug);

    res.json({
      equipment: data.equipment,
      gyms: data.gyms,
    });
  } catch (err) {
    console.error('FULL ERROR:', err);

    if (err.message === 'Equipment not found') {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.status(500).json({ error: 'Failed to fetch gyms for equipment' });
  }
};

module.exports = {
  getGymsWithEquipment,
};