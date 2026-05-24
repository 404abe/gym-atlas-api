const pool = require('../db');
const cloudinary = require('../config/cloudinary');

// CREATE new equipment (catalog)
const createEquipment = async (brand, series, name, type, createdBy = null) => {
	const slug = `${brand}-${series || ''}-${name}`
		.toLowerCase()
		.replace(/[\/\\]/g, '-')
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');

	const result = await pool.query(
		`INSERT INTO equipment (brand, series, name, type, slug, status, created_by)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6) RETURNING *`,
		[brand, series, name, type, slug, createdBy]
	);
	return result.rows[0];
};

// Keep open for admin preview (no status filter)
const getEquipmentById = async (id, userId = null) => {
	const result = await pool.query(
		`
		SELECT 
			e.id, e.brand, e.series, e.name, e.slug, e.type, e.created_at, e.image_url, e.status,
			COALESCE(ROUND(AVG(er.rating), 1), 0) AS avg_rating,
			MAX(CASE WHEN er.user_id = $2 THEN er.rating END) AS user_rating
		FROM equipment e
		LEFT JOIN equipment_ratings er ON er.equipment_id = e.id
		WHERE e.id = $1
		GROUP BY e.id, e.brand, e.series, e.name, e.slug, e.type, e.created_at, e.image_url, e.status
		`,
		[id, userId]
	);
	return result.rows[0] || null;
};

const getAllEquipment = async (userId = null) => {
	const result = await pool.query(
		`
		SELECT 
			e.id, e.brand, e.series, e.name, e.slug, e.type, e.created_at, e.image_url, e.status,
			COALESCE(ROUND(AVG(er.rating), 1), 0) AS avg_rating,
			MAX(CASE WHEN er.user_id = $1 THEN er.rating END) AS user_rating
		FROM equipment e
		LEFT JOIN equipment_ratings er ON er.equipment_id = e.id
		WHERE e.status = 'approved'
		GROUP BY e.id, e.brand, e.series, e.name, e.slug, e.type, e.created_at, e.image_url, e.status
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
			ge.quantity
		FROM gym_equipment ge
		JOIN gyms g ON g.id = ge.gym_id
		JOIN equipment e ON e.id = ge.equipment_id
		WHERE e.slug = $1
		AND g.status = 'approved'
		ORDER BY ge.quantity DESC
		`,
		[slug]
	);
	return result.rows;
};

const getEquipmentBySlug = async (slug) => {
	const result = await pool.query(`SELECT id, name, brand, series FROM equipment WHERE slug = $1`, [
		slug
	]);
	return result.rows[0] || null;
};

const searchEquipmentByName = async (query) => {
	const result = await pool.query(
		`
		SELECT id, name, brand, series, slug, type
		FROM equipment
		WHERE 
			(name ILIKE $1
			OR slug ILIKE $1
			OR brand ILIKE $1
			OR series ILIKE $1)
		AND status = 'approved'
		ORDER BY name ASC
		LIMIT 10
		`,
		[`%${query}%`]
	);
	return result.rows;
};

const getBrands = async () => {
	const result = await pool.query(
		`SELECT DISTINCT brand FROM equipment
		WHERE brand IS NOT NULL
		ORDER BY brand ASC`
	);
	return result.rows.map((r) => r.brand);
};

const getSeriesByBrand = async (brand) => {
	const result = await pool.query(
		`SELECT DISTINCT series FROM equipment
		WHERE brand ILIKE $1
		AND series IS NOT NULL
		ORDER BY series ASC`,
		[brand]
	);
	return result.rows.map((r) => r.series);
};

const uploadEquipmentImage = async (id, fileBuffer) => {
	const result = await new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ folder: 'gym-atlas/equipment', resource_type: 'image' }, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			})
			.end(fileBuffer);
	});

	await pool.query('UPDATE equipment SET image_url = $1 WHERE id = $2', [result.secure_url, id]);
	return result.secure_url;
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
	getEquipmentById,
	getAllEquipment,
	getGymsByEquipmentSlug,
	getEquipmentBySlug,
	createEquipment,
	getBrands,
	getSeriesByBrand,
	uploadEquipmentImage,
	rateEquipment,
	favouriteEquipment,
	removeFavouriteEquipment,
	searchEquipmentByName
};
