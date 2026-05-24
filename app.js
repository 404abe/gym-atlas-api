const express = require('express');
const cors = require('cors');

// Route imports
const adminRoutes = require('./routes/adminRoutes');
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const bestInClassRoutes = require('./routes/bestInClassRoutes');

const app = express();

// CORS configuration
const corsOptions = {
	origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3001'
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Route definitions
app.use('/admin', adminRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/best-in-class', bestInClassRoutes);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
