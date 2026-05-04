const express = require('express');
const app = express();

app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);

// ONLY start server if not testing
if (require.main === module) {
	app.listen(3000, () => {
		console.log('Server running on port 3000');
	});
}

module.exports = app;