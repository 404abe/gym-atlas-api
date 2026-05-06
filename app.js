const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(
	cors({
		origin: 'http://localhost:3001'
	})
);

app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/auth', authRoutes);

module.exports = app;
