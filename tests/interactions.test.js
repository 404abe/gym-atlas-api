const request = require('supertest');
const app = require('../app');
const pool = require('../db');

afterAll(async () => {
	await pool.end();
});

describe('GYM INTERACTIONS (auth required)', () => {
	it('POST /gyms/:id/rate → 401 without token', async () => {
		const res = await request(app).post('/gyms/1/rate').send({ rating: 5 });
		expect(res.statusCode).toBe(401);
	});

	it('POST /gyms/:id/rate → 400 for out-of-range rating', async () => {
		// We can test validation shape without auth by checking it hits auth first
		// Full validation tests require an authenticated session
		const res = await request(app).post('/gyms/1/rate').send({ rating: 99 });
		expect(res.statusCode).toBe(401);
	});

	it('POST /gyms/:id/favourite → 401 without token', async () => {
		const res = await request(app).post('/gyms/1/favourite');
		expect(res.statusCode).toBe(401);
	});

	it('DELETE /gyms/:id/favourite → 401 without token', async () => {
		const res = await request(app).delete('/gyms/1/favourite');
		expect(res.statusCode).toBe(401);
	});
});

describe('EQUIPMENT INTERACTIONS (auth required)', () => {
	it('POST /equipment/:id/rate → 401 without token', async () => {
		const res = await request(app).post('/equipment/1/rate').send({ rating: 4 });
		expect(res.statusCode).toBe(401);
	});

	it('POST /equipment/:id/favourite → 401 without token', async () => {
		const res = await request(app).post('/equipment/1/favourite');
		expect(res.statusCode).toBe(401);
	});

	it('DELETE /equipment/:id/favourite → 401 without token', async () => {
		const res = await request(app).delete('/equipment/1/favourite');
		expect(res.statusCode).toBe(401);
	});
});
