const express = require('express');

const app = express();
const port = 3000;
const morgan = require('morgan');
const amazonItemsRouter = require('./src/routes/amazonItems.router');
const flipkartItemsRouter = require('./src/routes/flipkartItems.router');
const authRouter = require('./src/routes/auth.router');
const refreshRouter = require('./src/routes/refresh.router');
const productsRouter = require('./src/routes/product.router');
const verifyJWT = require('./src/middlewares/verifyJwt');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.use('/user', authRouter);
app.use('/refersh', verifyJWT, refreshRouter);
app.use('/amazon', verifyJWT, amazonItemsRouter);
app.use('/flipkart', verifyJWT, flipkartItemsRouter);
app.use('/product', verifyJWT, productsRouter);

app.all('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
