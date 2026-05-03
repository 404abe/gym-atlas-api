const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
app.use('/gyms', gymRoutes);

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/equipment', equipmentRoutes);

module.exports = app;