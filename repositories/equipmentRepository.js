const pool = require('../db');

// CREATE new equipment (catalog)
const createEquipment = async (brand, series, name, type) => {
	const slug = `${brand}-${series}-${name}`.toLowerCase().replace(/\s+/g, '-');

	const result = await pool.query(
		`
		INSERT INTO equipment (brand, series, name, type, slug)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
		`,
		[brand, series, name, type, slug]
	);

	return result.rows[0];
};

const getGymsByEquipmentSlug = async (slug) => {
	const result = await pool.query(
		`
    SELECT 
      g.id,
      g.name,
      g.city,
      g.country,
      ge.count
    FROM gym_equipment ge
    JOIN gyms g ON g.id = ge.gym_id
    JOIN equipment e ON e.id = ge.equipment_id
    WHERE e.slug = $1
    ORDER BY ge.count DESC;
    `,
		[slug]
	);

	return result.rows;
};

const getEquipmentBySlug = async (slug) => {
	const result = await pool.query(
		`
    SELECT id, name, brand, series
    FROM equipment
    WHERE slug = $1
    `,
		[slug]
	);

	return result.rows[0];
};

const rateEquipment = async (userId, equipmentId, rating) => {
	const result = await pool.query(
		`
	INSERT INTO equipment_ratings (user_id, equipment_id, rating)
	VALUES ($1, $2, $3)
	ON CONFLICT (user_id, equipment_id)
	DO UPDATE SET rating = EXCLUDED.rating
	RETURNING *
	`,
		[userId, equipmentId, rating]
	);

	return result.rows[0];
};

const favouriteEquipment = async (userId, equipmentId) => {
	const result = await pool.query(
		`
		INSERT INTO equipment_favourites (user_id, equipment_id)
		VALUES ($1, $2)
		ON CONFLICT DO NOTHING
		RETURNING *
		`,
		[userId, equipmentId]
	);

	return result.rows[0] || null;
};

const removeFavouriteEquipment = async (userId, equipmentId) => {
	const result = await pool.query(
		`
		DELETE FROM equipment_favourites
		WHERE user_id = $1 AND equipment_id = $2
		RETURNING *
		`,
		[userId, equipmentId]
	);

	return result.rows[0] || null;
};

module.exports = {
	getGymsByEquipmentSlug,
	getEquipmentBySlug,
	createEquipment,
	favouriteEquipment,
	rateEquipment,
	removeFavouriteEquipment,
	favouriteEquipment
};
