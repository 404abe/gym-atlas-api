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

const getAllEquipment = async (userId = null) => {
	const result = await pool.query(
		`
	  SELECT 
		e.*,
		COALESCE(ROUND(AVG(er.rating), 1), 0) AS avg_rating,
		MAX(CASE WHEN er.user_id = $1 THEN er.rating END) AS user_rating
	  FROM equipment e
	  LEFT JOIN equipment_ratings er ON er.equipment_id = e.id
	  GROUP BY e.id
	  ORDER BY e.brand, e.name
	`,
		[userId]
	);
	return result.rows;
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

const searchEquipmentByName = async (query) => {
	const result = await pool.query(
		`
		SELECT 
			id,
			name,
			brand,
			series,
			slug,
			type
		FROM equipment
		WHERE 
			name ILIKE $1
			OR slug ILIKE $1
			OR brand ILIKE $1
			OR series ILIKE $1
		ORDER BY name ASC
		LIMIT 10
		`,
		[`%${query}%`]
	);
	return result.rows;
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
	getAllEquipment,
	getGymsByEquipmentSlug,
	getEquipmentBySlug,
	createEquipment,
	favouriteEquipment,
	rateEquipment,
	removeFavouriteEquipment,
	searchEquipmentByName
};
