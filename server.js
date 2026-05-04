const express = require('express');
const cors = require('cors');

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3001'
	})
);

app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
