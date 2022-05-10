const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const productRouter = require('./routes/productRouters');
const reportRouter = require('./routes/reportRouters');

app.use('/api/products', productRouter);
app.use('/api/create_report', reportRouter);

module.exports = app;