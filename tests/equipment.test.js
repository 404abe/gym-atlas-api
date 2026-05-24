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
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('GET /equipment/search', () => {
	it('returns 200 and an array for a valid query', async () => {
		const res = await request(app).get('/equipment/search?query=press');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('returns empty array when no query param', async () => {
		const res = await request(app).get('/equipment/search');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);
	});
});

describe('GET /equipment/brands', () => {
	it('returns 200 and a brands array', async () => {
		const res = await request(app).get('/equipment/brands');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('brands');
		expect(Array.isArray(res.body.brands)).toBe(true);
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
		expect(res.body).toHaveProperty('series');
		expect(Array.isArray(res.body.series)).toBe(true);
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
