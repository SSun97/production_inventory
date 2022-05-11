const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const axios = require('axios');

const getProducts = async () => {
  const url = `http://localhost:3000/api/products/`;
  const response = await axios.get(url);
  // console.log(response.data.weather);
  // console.log(typeof(response.data));
  return response.data.data;
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get products data from collection
  const products = await getProducts();
  console.log(products.data[0]);
  res.status(200).render('overview', {
    title: 'All tours',
    products,
  });
});
exports.getAddProductForm = (req, res) => {
  res.status(200).render('addProduct', {
    title: 'Add New Product',
  });
};