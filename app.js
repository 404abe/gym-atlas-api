const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

app.use('/gyms', gymRoutes);
app.use('/equipment', equipmentRoutes);

module.exports = app;