const pool = require('../db');

// GET gym equipment
const getGymEquipment = async (gymId) => {
	const result = await pool.query(
		`
		SELECT 
			e.brand,
			e.series,
			e.name,
			ge.quantity
		FROM gym_equipment ge
		JOIN equipment e ON ge.equipment_id = e.id
		WHERE ge.gym_id = $1
		ORDER BY e.brand, e.name
		`,
		[gymId]
	);

	return result.rows;
};

// INSERT gym equipment
const addGymEquipment = async (gymId, equipmentId, quantity, notes) => {
	const result = await pool.query(
		`
		INSERT INTO gym_equipment (gym_id, equipment_id, quantity, notes)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (gym_id, equipment_id)
		DO UPDATE SET
			quantity = EXCLUDED.quantity,
			notes = EXCLUDED.notes,
			updated_at = NOW()
		RETURNING *
		`,
		[gymId, equipmentId, quantity, notes]
	);

	return result.rows[0];
};

//

const getGymStats = async () => {
	const result = await pool.query(`
  
SELECT 
  g.id,
  g.name,
  COALESCE(SUM(ge.count), 0)::INT AS total_equipment,
  COUNT(DISTINCT ge.equipment_id)::INT AS unique_machines
FROM gyms g
LEFT JOIN gym_equipment ge ON ge.gym_id = g.id
GROUP BY g.id, g.name
ORDER BY total_equipment DESC;
  
    `);

	return result.rows;
};

// btw theere has to be a way to not have to write this in every file
module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats
};
