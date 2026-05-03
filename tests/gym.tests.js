const request = require('supertest');
const app = require('../app');

const pool = require('../db');

afterAll(async () => {
	await pool.end();
});

describe('GYMS API', () => {
	it('POST /gyms → creates a gym', async () => {
		const res = await request(app).post('/gyms').send({
			name: 'Test Gym Jest',
			latitude: 55.95,
			longitude: -3.18
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.name).toBe('Test Gym Jest');
	});

	it('GET /gyms/stats → returns gyms list', async () => {
		const res = await request(app).get('/gyms/stats');

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});
});
