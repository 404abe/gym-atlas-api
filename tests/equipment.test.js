const request = require('supertest');
const app = require('../app');
const pool = require('../db');

afterAll(async () => {
	await pool.end();
});

describe('GET /equipment', () => {
	it('returns 200 and an array', async () => {
		const res = await request(app).get('/equipment');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});
});

describe('GET /equipment/search', () => {
	it('returns 200 and an array for a valid query', async () => {
		const res = await request(app).get('/equipment/search?query=press');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});

	it('returns empty array when no query param', async () => {
		const res = await request(app).get('/equipment/search');
		expect(res.statusCode).toBe(200);
		expect(res.body.data).toEqual([]);
	});
});

describe('GET /equipment/brands', () => {
	it('returns 200 and a brands array', async () => {
		const res = await request(app).get('/equipment/brands');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});
});

describe('GET /equipment/series', () => {
	it('returns 400 when brand param is missing', async () => {
		const res = await request(app).get('/equipment/series');
		expect(res.statusCode).toBe(400);
	});

	it('returns 200 and a series array for a valid brand', async () => {
		const res = await request(app).get('/equipment/series?brand=Matrix');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});
});

describe('PATCH /admin/equipment/:id', () => {
	it('updates equipment details for an admin', async () => {
		const res = await request(app)
			.patch('/admin/equipment/1')
			.set('Authorization', 'Bearer local-dev')
			.send({
				brand: 'Matrix',
				series: 'Aura',
				name: 'Chest Press Jest Test',
				type: 'pin_loaded',
				resistance_profile: 'ascending',
				resistance_curve: null
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.data).toMatchObject({
			brand: 'Matrix',
			series: 'Aura',
			name: 'Chest Press Jest Test',
			type: 'pin_loaded',
			resistance_profile: 'ascending'
		});

		const followUp = await request(app)
			.get('/equipment/1')
			.set('Authorization', 'Bearer local-dev');
		expect(followUp.body.data.name).toBe('Chest Press Jest Test');
	});
});

describe('POST /equipment (auth required)', () => {
	it('returns 401 when no token provided', async () => {
		const res = await request(app)
			.post('/equipment')
			.send({ brand: 'TestBrand', name: 'Test Machine', type: 'pin_loaded' });
		expect(res.statusCode).toBe(401);
	});
});

describe('POST /equipment/:id/rate (auth required)', () => {
	it('returns 401 when no token provided', async () => {
		const res = await request(app).post('/equipment/1/rate').send({ rating: 4 });
		expect(res.statusCode).toBe(401);
	});
});

describe('POST /equipment/:id/favourite (auth required)', () => {
	it('returns 401 when no token provided', async () => {
		const res = await request(app).post('/equipment/1/favourite');
		expect(res.statusCode).toBe(401);
	});
});

describe('DELETE /equipment/:id/favourite (auth required)', () => {
	it('returns 401 when no token provided', async () => {
		const res = await request(app).delete('/equipment/1/favourite');
		expect(res.statusCode).toBe(401);
	});
});
