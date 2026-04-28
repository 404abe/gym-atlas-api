const express = require('express');
const app = express();

app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
app.use('/gyms', gymRoutes);

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/equipment', equipmentRoutes);

const gymController = require('./controllers/gymController');
app.us

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
