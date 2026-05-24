require('dotenv').config();

// Global error handlers
process.on('uncaughtException', (err) => {
	console.error('Uncaught exception:', err);
	process.exit(1);
});
process.on('unhandledRejection', (err) => {
	console.error('Unhandled rejection:', err);
});

const app = require('./app');
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
