process.on('uncaughtException', (err) => {
	console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
	console.error('Unhandled rejection:', err);
});

const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
