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
  // console.log(products.data[0]);
  res.status(200).render('overview', {
    title: 'All productss',
    products,
  });
});
exports.getAddProductForm = (req, res) => {
  res.status(200).render('addProduct', {
    title: 'Add New Product',
  });
};
// exports.getUpdateProductForm = (req, res) => {
//   res.status(200).render('addProduct', {
//     title: 'Update Product',
//   });
// };
exports.getUpdateProductForm = catchAsync(async (req, res, next) => {
  const data = await getProducts();
  const products = data.data;
  const product = await products.find(
    (product) => product.slug === req.params.slug
  );
  if (!product) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  res.status(200).render('updateProduct', {
    title: `update ${product.name}`,
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const url = `http://localhost:3000/api/products/${req.params.id}`;
  await axios.delete(url);
  setTimeout(() => {}, 1000);
  res.redirect('/');
});
