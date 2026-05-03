const express = require('express');
const cors = require('cors');
const app = require('./app');

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

const app = express();

app.use(express.json());

// allow frontend (3001) to call backend (3000)
app.use(cors({
  origin: "http://localhost:3001"
}));

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});