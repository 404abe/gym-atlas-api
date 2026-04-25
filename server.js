const express = require('express');
const app = express();

app.use(express.json());

// routes
const gymRoutes = require('./routes/gymRoutes');
app.use('/gyms', gymRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
