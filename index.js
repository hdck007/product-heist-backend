const express = require('express');
const app = express();
const port = 3000;
const amazonItemsRouter = require('./src/routes/amazonItems.router');
const flipkartItemsRouter = require('./src/routes/flipkartItems.router');
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({ message: 'ok' });
});

app.use('/amazon', amazonItemsRouter);
app.use('/flipkart', flipkartItemsRouter);

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	console.error(err.message, err.stack);
	res.status(statusCode).json({ message: err.message });
	return;
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
