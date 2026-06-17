const { Pool } = require('pg');

if (process.env.USE_PG_MEM === 'true') {
	module.exports = require('./devDb');
} else {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL
	});

	module.exports = pool;
}
