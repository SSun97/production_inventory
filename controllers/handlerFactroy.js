const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const axios = require('axios');
const AppError = require('../utils/appError');
const slug = require('slugify');
const { parseAsync } = require('json2csv');
let data = fs.readFileSync(`${__dirname}/../data/products.json`);
let cities = fs.readFileSync(`${__dirname}/../data/cities.json`);
let products = JSON.parse(data);
let cityObj = JSON.parse(cities);

const warehouseLocation = [
  'New York',
  'Los Angeles',
  'Chicago',
  'San Francisco',
  'Boston',
];

const getWeather = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=2bfe5bf547d1711c4c173fce24a90b71`;
  const response = await axios.get(url);
  // console.log(response.data.weather);
  return response.data.weather;
};
exports.getReport = () =>
  catchAsync(async (req, res, next) => {
    const fields = ['name', 'quantity', 'description', 'city'];
    const opts = { fields };
    parseAsync(products, opts)
      // .then((csv) => console.log(csv))
      .then(
        (csv) => {
          fs.writeFile(`${__dirname}/../public/reports/products.csv`, csv, {}, (err) => {});
        }
      )
      .catch((err) => console.error(err));
    res.download(`${__dirname}/../public/reports/products.csv`);
  });

exports.getAll = () =>
  catchAsync(async (req, res, next) => {
    const productsWithWeather = await Promise.all(
      products.map(async (product) => {
        const city = cityObj.find((city) => city.city === product.city);
        const weather = await getWeather(city.lat, city.lon);
        return { ...product, weather };
      })
    );
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        data: productsWithWeather,
      },
    });
  });
exports.getOne = () =>
  catchAsync(async (req, res, next) => {
    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    if (!product) {
      return next(
        new AppError(`No product with the id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: product,
      },
    });
  });

exports.createOne = () =>
  catchAsync(async (req, res, next) => {
    if (
      !req.query.city ||
      !req.query.description ||
      !req.query.quantity ||
      !req.query.name
    ) {
      return next(
        new AppError(
          `Please provide all the required fields(name, quantity, description and city of storage)`,
          400
        )
      );
    }
    if (!warehouseLocation.includes(req.query.city)) {
      return next(new AppError(`Please provide a valid city`, 400));
    }
    const productNames = products.map((product) => product.name);
    if (productNames.includes(req.query.name)) {
      return next(
        new AppError(
          `Product with the name ${req.query.name} already exists`,
          400
        )
      );
    }
    if (isNaN(req.query.quantity)) {
      return next(new AppError(`Please provide a valid quantity`, 400));
    }
    const newProduct = req.query;
    newProduct.id = Math.floor(Math.random() * 90000) + 10000;
    newProduct.slug = slug(newProduct.name, { lower: true });
    products.push(newProduct);
    fs.writeFile(
      `${__dirname}/../data/products.json`,
      JSON.stringify(products),
      (err) => {
        if (err) {
          return next(new AppError(`Failed to create the product`, 500));
        }
        console.log('The file has been created successfully');
      }
    );
    res.status(201).json({
      status: 'success',
      data: {
        data: newProduct,
      },
    });
  });
exports.updateOne = () =>
  catchAsync(async (req, res, next) => {
    if (
      !req.query.city &&
      !req.query.description &&
      !req.query.quantity &&
      !req.query.name
    ) {
      return next(
        new AppError(
          `Please provide at least one field to update(name, quantity, description and city of storage)`,
          400
        )
      );
    }
    if (req.query.city && !warehouseLocation.includes(req.query.city)) {
      return next(new AppError(`Please provide a valid city`, 400));
    }
    const productNames = products.map((product) => product.name);
    if (req.query.name && productNames.includes(req.query.name)) {
      return next(
        new AppError(
          `Product with the name ${req.query.name} already exists`,
          400
        )
      );
    }
    if (req.query.quantity && isNaN(req.query.quantity)) {
      return next(new AppError(`Please provide a valid quantity`, 400));
    }
    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    if (!product) {
      return next(
        new AppError(`No product with the id of ${req.params.id}`, 404)
      );
    }
    Object.keys(req.query).forEach((key) => {
      product[key] = req.query[key];
    });
    fs.writeFile(
      `${__dirname}/../data/products.json`,
      JSON.stringify(products),
      (err) => {
        if (err) {
          return next(new AppError(`Failed to update the product`, 500));
        }
        console.log('The file has been updated successfully');
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        data: product,
      },
    });
  });

exports.deleteOne = () =>
  catchAsync(async (req, res, next) => {
    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    if (!product) {
      return next(
        new AppError(`No product with the id of ${req.params.id}`, 404)
      );
    }
    products = products.filter(
      (product) => product.id !== parseInt(req.params.id)
    );
    fs.writeFile(
      `${__dirname}/../data/products.json`,
      JSON.stringify(products),
      (err) => {
        if (err) {
          return next(new AppError(`Failed to update the product`, 500));
        }
        console.log('The file has been deteled successfully');
      }
    );
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  });
