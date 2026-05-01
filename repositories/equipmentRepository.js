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

module.exports = {
	getGymsByEquipmentSlug,
	getEquipmentBySlug,
	createEquipment
};
