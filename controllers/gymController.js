const gymService = require('../services/gymService');

const getGymEquipment = async (req, res) => {
  try {
    const data = await gymService.getGymEquipment(req.params.id);

    res.json({
      gym_id: req.params.id,
      equipment: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gym equipment' });
  }
};

const addGymEquipment = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { equipment_id, count, notes } = req.body;

    const result = await gymService.addGymEquipment(
      gymId,
      equipment_id,
      count,
      notes
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add equipment to gym' });
  }
};

const getGymStats = async (req, res) => {
    try{
        const stats = await gymService.getGymStats();

        res.json({
            data:stats,
        });  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to fetch gym stats' });
    }
}

module.exports = {
  getGymEquipment,
  addGymEquipment,
  getGymStats,
};