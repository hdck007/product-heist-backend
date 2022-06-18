const express = require('express');

const app = express();
const port = 3000;
const morgan = require('morgan');
const amazonItemsRouter = require('./src/routes/amazonItems');
const flipkartItemsRouter = require('./src/routes/flipkartItems.router');
const authRouter = require('./src/routes/auth.router');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.use('/user', authRouter);
app.use('/amazon', amazonItemsRouter);
app.use('/flipkart', flipkartItemsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
