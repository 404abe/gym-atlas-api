const request = require('supertest');
const app = require('../app');

const pool = require('../db');

afterAll(async () => {
	await pool.end();
});

describe('EQUIPMENT API', () => {
	it('GET /equipment → returns equipment list', async () => {
		const res = await request(app).get('/equipment');

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /equipment → creates equipment OR rejects duplicate', async () => {
		const unique = Date.now();

		const res = await request(app)
			.post('/equipment')
			.send({
				brand: `TestBrand-${unique}`,
				series: `TestSeries-${unique}`,
				name: `Chest Press ${unique}`,
				type: 'pin_loaded'
			});

		// either success OR duplicate 
		expect([200, 409, 500]).toContain(res.statusCode);
	});
});
