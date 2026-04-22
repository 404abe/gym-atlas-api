require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Gym API is running 🚀');
});

//  GET all equipment
app.get('/equipment', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM equipment LIMIT 100');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

//  GET gyms that have a specific equipment
app.get('/gyms/:id/equipment', async (req, res) => {
	const { id } = req.params;

	try {
		// 1. get gym info
		const gymResult = await pool.query('SELECT id, name, city, country FROM gyms WHERE id = $1', [
			id
		]);

		if (gymResult.rows.length === 0) {
			return res.status(404).json({ error: 'Gym not found' });
		}

		const gym = gymResult.rows[0];

		// 2. get equipment
		const equipmentResult = await pool.query(
			`SELECT 
          e.brand,
          e.series,
          e.name,
          ge.count
        FROM gym_equipment ge
        JOIN equipment e ON e.id = ge.equipment_id
        WHERE ge.gym_id = $1`,
			[id]
		);

		// 3. return combined response
		res.json({
			gym,
			equipment: equipmentResult.rows
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

//  GET equipment in a gym
app.get('/gyms/:id/equipment', async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			`SELECT 
        e.brand,
        e.series,
        e.name,
        ge.count
      FROM gym_equipment ge
      JOIN equipment e ON e.id = ge.equipment_id
      WHERE ge.gym_id = $1`,
			[id]
		);

		res.json({
			success: true,

			gymId: id,

			equipment: result.rows
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
