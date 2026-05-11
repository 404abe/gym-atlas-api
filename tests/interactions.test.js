const app = require('../app');
const request = require('supertest');

describe('GYM + EQUIPMENT INTERACTIONS', () => {
	const userId = 1;
	const gymId = 2;
	const equipmentId = 1;


	// GYM RATING

	test('POST /gyms/:id/rate → creates/updates rating', async () => {
		const res = await request(app).post(`/gyms/${gymId}/rate`).send({
			user_id: userId,
			rating: 5
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('gym_id', gymId);
		expect(res.body).toHaveProperty('rating', 5);
	});


	// EQUIPMENT RATING

	test('POST /equipment/:id/rate → creates/updates rating', async () => {
		const res = await request(app).post(`/equipment/${equipmentId}/rate`).send({
			user_id: userId,
			rating: 4
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('equipment_id', equipmentId);
		expect(res.body).toHaveProperty('rating', 4);
	});

	// GYM FAVOURITE

	test('POST /gyms/:id/favourite → adds favourite', async () => {
		const res = await request(app).post(`/gyms/${gymId}/favourite`).send({
			user_id: userId
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('user_id', userId);
		expect(res.body).toHaveProperty('gym_id', gymId);
	});

	test('DELETE /gyms/:id/favourite → removes favourite', async () => {
		const res = await request(app).delete(`/gyms/${gymId}/favourite`).send({
			user_id: userId
		});

		expect(res.statusCode).toBe(200);
	});


	// EQUIPMENT FAVOURITE
	test('POST /equipment/:id/favourite → adds favourite', async () => {
		const res = await request(app).post(`/equipment/${equipmentId}/favourite`).send({
			user_id: userId
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('user_id', userId);
		expect(res.body).toHaveProperty('equipment_id', equipmentId);
	});

	test('DELETE /equipment/:id/favourite → removes favourite', async () => {
		const res = await request(app).delete(`/equipment/${equipmentId}/favourite`).send({
			user_id: userId
		});

		expect(res.statusCode).toBe(200);
	});
});
