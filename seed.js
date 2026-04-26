const { Pool } = require('pg');
const equipmentData = require('./seed-data/equipment.json');
const gymsData = require('./seed-data/gyms.json');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'gymapp',
	password: 'postgres',
	port: 5432
});

function createSlug(brand, series, name) {
	return `${brand}-${series || ''}-${name}`
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/--+/g, '-')
		.replace(/^-|-$/g, '');
}

// Seed equipment
async function seedEquipment() {
	for (const item of equipmentData) {
		const slug = createSlug(item.brand, item.series, item.name);

		await pool.query(
			`INSERT INTO equipment (brand, series, name, slug, type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO NOTHING`,
			[item.brand, item.series, item.name, slug, item.type]
		);
	}

	console.log('✅ Equipment seeded');
}

// Seed gyms
async function seedGyms() {
	for (const gym of gymsData) {
		await pool.query(
			`INSERT INTO gyms (name, slug, city, country, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO NOTHING`,
			[gym.name, gym.slug, gym.city, gym.country, gym.latitude, gym.longitude]
		);
	}

	console.log('✅ Gyms seeded');
}

//  Link gyms to equipment
async function linkGymEquipment() {
	const gymsRes = await pool.query('SELECT id FROM gyms');
	const equipmentRes = await pool.query('SELECT id FROM equipment');

	const gyms = gymsRes.rows;
	const equipment = equipmentRes.rows;

	for (const gym of gyms) {
		for (let i = 0; i < 20; i++) {
			const randomEq = equipment[Math.floor(Math.random() * equipment.length)];

			await pool.query(
				`INSERT INTO gym_equipment (gym_id, equipment_id, count)
         VALUES ($1, $2, $3)
         ON CONFLICT (gym_id, equipment_id) DO NOTHING`,
				[gym.id, randomEq.id, Math.ceil(Math.random() * 3)]
			);
		}
	}

	console.log('✅ Gym equipment linked');
}

//  Main runner
async function seed() {
	try {
		console.log('🌱 Starting seed...');

		await pool.query(`

        TRUNCATE TABLE gym_equipment, gyms, equipment RESTART IDENTITY CASCADE;
  
      `);
		await seedEquipment();
		await seedGyms();
		await linkGymEquipment();

		console.log('💯 Seeding complete');
	} catch (err) {
		console.error('❌ Error seeding:', err);
	} finally {
		await pool.end();
		process.exit();
	}
}

seed();
