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

// ADD / UPSERT
const addGymEquipment = async (gymId, equipmentId, quantity, notes) => {
	const result = await pool.query(
		`
		INSERT INTO gym_equipment (gym_id, equipment_id, quantity, notes)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (gym_id, equipment_id)
		DO UPDATE SET 
			quantity = EXCLUDED.quantity,
			notes = EXCLUDED.notes
		RETURNING *
		`,
		[gymId, equipmentId, quantity, notes]
	);

	return result.rows[0];
};

// STATS
const getGymStats = async () => {
	const result = await pool.query(
		`
		SELECT 
			g.id,
			g.name,
			COALESCE(SUM(ge.quantity), 0)::INT AS total_equipment,
			COUNT(DISTINCT ge.equipment_id)::INT AS unique_machines
		FROM gyms g
		LEFT JOIN gym_equipment ge ON ge.gym_id = g.id
		GROUP BY g.id, g.name
		ORDER BY total_equipment DESC
		`
	);

	return result.rows;
};

// DECREMENT
const decrementGymEquipment = async (gymId, equipmentId) => {
	const result = await pool.query(
		`
		UPDATE gym_equipment
		SET quantity = quantity - 1
		WHERE gym_id = $1
		AND equipment_id = $2
		AND quantity > 1
		RETURNING *
		`,
		[gymId, equipmentId]
	);

	return result.rows[0] || null;
};

// DELETE (when quantity = 1)
const deleteGymEquipment = async (gymId, equipmentId) => {
	const result = await pool.query(
		`
		DELETE FROM gym_equipment
		WHERE gym_id = $1
		AND equipment_id = $2
		AND quantity = 1
		RETURNING *
		`,
		[gymId, equipmentId]
	);

	return result.rows[0] || null;
};

// GET equipment (for enrichment)
const getEquipmentById = async (id) => {
	const result = await pool.query(
		`SELECT * FROM equipment WHERE id = $1`,
		[id]
	);

	return result.rows[0] || null;
};

module.exports = {
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	decrementGymEquipment,
	deleteGymEquipment,
	getEquipmentById
};