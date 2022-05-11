const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const viewRouter = require('./routes/viewRoutes');
const productRouter = require('./routes/productRouters');
const reportRouter = require('./routes/reportRouters');
// create router
app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/create_report', reportRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;