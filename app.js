const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'http://192.168.0.131:3000',
			'http://192.168.0.131:3001'
		]
	})
);
app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
