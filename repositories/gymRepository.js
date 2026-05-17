const pool = require('../db');

const getGyms = async (userId = null) => {
	const result = await pool.query(
		`
	  SELECT 
		g.id,
		g.name,
		g.latitude AS lat,
		g.longitude AS lng,
		COALESCE(SUM(ge.quantity), 0)::INT AS total_equipment,
		COUNT(DISTINCT ge.equipment_id)::INT AS unique_machines,
		COALESCE(ROUND(AVG(gr.rating), 1), 0) AS avg_rating,
		MAX(CASE WHEN gr.user_id = $1 THEN gr.rating END) AS user_rating,
		COUNT(DISTINCT gf.user_id)::INT AS favourites
	  FROM gyms g
	  LEFT JOIN gym_equipment ge ON ge.gym_id = g.id
	  LEFT JOIN gym_ratings gr ON gr.gym_id = g.id
	  LEFT JOIN gym_favourites gf ON gf.gym_id = g.id
	  GROUP BY g.id
	`,
		[userId]
	);
	return result.rows;
};

const getGymById = async (id) => {
	const result = await pool.query(
		`SELECT id, name, slug, address, city, country, latitude AS lat, longitude AS lng, instagram, created_at
FROM gyms WHERE id = $1`,
		[id]
	);
	return result.rows[0] || null;
};

const createGym = async (name, latitude, longitude) => {
	const slug = name.toLowerCase().replace(/\s+/g, '-');

	const result = await pool.query(
		`
		INSERT INTO gyms (name, slug, latitude, longitude)
		VALUES ($1, $2, $3, $4)
		RETURNING *
		`,
		// array bellow are the values that go into, $1,$2 etc.
		[name, slug, latitude, longitude]
	);

	return result.rows[0];
};

// GET gym equipment
const getGymEquipment = async (gymId) => {
	const result = await pool.query(
		`
		SELECT 
			e.id AS equipment_id,
			e.brand,
			e.series,
			e.name,
			CONCAT_WS(' ', e.brand, e.series, e.name) AS full_name,
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
  g.latitude AS lat,
  g.longitude AS lng,

  COALESCE(SUM(ge.quantity), 0)::INT AS total_equipment,
  COUNT(DISTINCT ge.equipment_id)::INT AS unique_machines,

  ROUND(AVG(gr.rating), 1) AS avg_rating,
  COUNT(DISTINCT gf.user_id) AS hearts

FROM gyms g
LEFT JOIN gym_equipment ge ON ge.gym_id = g.id
LEFT JOIN gym_ratings gr ON gr.gym_id = g.id
LEFT JOIN gym_favourites gf ON gf.gym_id = g.id

GROUP BY g.id
ORDER BY total_equipment DESC;
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

const getEquipmentById = async (id) => {
	const result = await pool.query(`SELECT * FROM equipment WHERE id = $1`, [id]);

	return result.rows[0] || null;
};

const rateGym = async (userId, gymId, rating) => {
	const result = await pool.query(
		`
		INSERT INTO gym_ratings (user_id, gym_id, rating)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, gym_id)
		DO UPDATE SET rating = EXCLUDED.rating
		RETURNING *
		`,
		[userId, gymId, rating]
	);

	return result.rows[0];
};

const favouriteGym = async (userId, gymId) => {
	const result = await pool.query(
		`
		INSERT INTO gym_favourites (user_id, gym_id)
		VALUES ($1, $2)
		ON CONFLICT DO NOTHING
		RETURNING *
		`,
		[userId, gymId]
	);

	return result.rows[0] || null;
};

const removeFavouriteGym = async (userId, gymId) => {
	const result = await pool.query(
		`
		DELETE FROM gym_favourites
		WHERE user_id = $1 AND gym_id = $2
		RETURNING *
		`,
		[userId, gymId]
	);

	return result.rows[0] || null;
};

const searchGymsByMachines = async (filters) => {
	const patterns = filters.map((f) => `%${f}%`);

	const result = await pool.query(
		`
		SELECT 
			g.id,
			g.name,
			g.latitude AS lat,
			g.longitude AS lng,
			COALESCE(SUM(ge.quantity), 0)::INT AS total_equipment,
			COUNT(DISTINCT ge.equipment_id)::INT AS unique_machines,
			COALESCE(ROUND(AVG(gr.rating), 1), 0)::FLOAT AS rating,
			COUNT(DISTINCT gf.user_id)::INT AS favourites

		FROM gyms g
		JOIN gym_equipment ge ON ge.gym_id = g.id
		JOIN equipment e ON e.id = ge.equipment_id

		LEFT JOIN gym_ratings gr ON gr.gym_id = g.id
		LEFT JOIN gym_favourites gf ON gf.gym_id = g.id

		WHERE CONCAT_WS(' ', e.brand, e.series, e.name) ILIKE ANY($1)

		GROUP BY g.id
		HAVING COUNT(DISTINCT e.id) = $2
		`,
		[patterns, filters.length]
	);

	return result.rows;
};
const getFavouriteGyms = async (userId) => {
	const result = await pool.query(
		`
		SELECT g.*
		FROM gym_favourites gf
		JOIN gyms g ON g.id = gf.gym_id
		WHERE gf.user_id = $1
		ORDER BY gf.created_at DESC
		`,
		[userId]
	);

	return result.rows;
};

module.exports = {
	getGyms,
	getGymById,
	getGymEquipment,
	addGymEquipment,
	getGymStats,
	decrementGymEquipment,
	deleteGymEquipment,
	getEquipmentById,
	createGym,
	rateGym,
	favouriteGym,
	favouriteGym,
	removeFavouriteGym,
	searchGymsByMachines,
	getFavouriteGyms
};
