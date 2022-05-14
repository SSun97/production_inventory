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
const getToday = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  return today;
}
// Get weather data function from openweathermap
const getWeather = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=2bfe5bf547d1711c4c173fce24a90b71`;
  const response = await axios.get(url);
  // console.log(response.data.weather);
  return response.data.weather;
};
// Create a report according to the json data
exports.createReport = () =>
  catchAsync(async (req, res, next) => {
    const fields = ['name', 'quantity', 'description', 'city'];
    const opts = { fields };
    const today = getToday();

    // fs.unlinkSync(`${__dirname}/../public/reports/Inventory-${today}.csv`);
    parseAsync(products, opts)
      .then((csv) => {
        fs.writeFile(
          `${__dirname}/../public/reports/Inventory-${today}.csv`,
          csv,
          {},
          (err) => {}
        );
      }).catch((err) => console.error(err));
      next();
    // await res.download(`${__dirname}/../public/reports/Inventory-${today}.csv`);
  });
exports.downloadReport = () => catchAsync(async (req, res, next) => {
  const today = getToday();
  await new Promise(res => setTimeout(res, 1000));
  res.redirect(`/reports/Inventory-${today}.csv`);
});
// Get all products with weather information
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
// Get a specific product with provided id
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
// Create a new product
exports.createOne = () =>
  catchAsync(async (req, res, next) => {
    // Check if any requirted fields are missing
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
    // Check if the city is valid
    if (!warehouseLocation.includes(req.query.city)) {
      return next(new AppError(`Please provide a valid city`, 400));
    }
    const productNames = products.map((product) => product.name);
    // Check if the product name already exists
    if (productNames.includes(req.query.name)) {
      return next(
        new AppError(
          `Product with the name ${req.query.name} already exists`,
          400
        )
      );
    }
    // Check if the quantity is a number
    if (isNaN(req.query.quantity)) {
      return next(new AppError(`Please provide a valid quantity`, 400));
    }
    // Create a new product object, push it to the products array and write it to the json file
    const newProduct = req.query;
    newProduct.name = newProduct.name.trim();
    newProduct.description = newProduct.description.trim();
    // console.log(newProduct);
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
// Update a product with provided id
exports.updateOne = () =>
  catchAsync(async (req, res, next) => {
    // Need to at least provide one field to update
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
    // If city exists, it needs to be a valid city
    if (req.query.city && !warehouseLocation.includes(req.query.city)) {
      return next(new AppError(`Please provide a valid city`, 400));
    }
    if (req.query.quantity && isNaN(req.query.quantity)) {
      return next(new AppError(`Please provide a valid quantity`, 400));
    }
    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    const otherProducts = products.filter(el => el.id !== parseInt(req.params.id));
    // If the product does not exist, return an error
    if (!product) {
      return next(
        new AppError(`No product with the id of ${req.params.id}`, 404)
      );
    }
    // Update the product with the new values
    if (req.query.name) {
      req.query.name = req.query.name.trim();
    }
    if (req.query.description) {
      req.query.description = req.query.description.trim();
    }
    const otherProductNames = otherProducts.map((product) => product.name);
    if (otherProductNames.includes(req.query.name)) {
      return next(new AppError(`Product with the name ${req.query.name} already exists`, 400));
      // res.status(400).json({
      //   status: 'error',
      //   message: `Product with the name ${req.query.name} already exists`,
      // });
    }
    Object.keys(req.query).forEach((key) => {

      // Check if the product name already exists

      product[key] = req.query[key];
    });
    // Write the new products to the json file
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
// Delete a product with provided id
exports.deleteOne = () =>
  catchAsync(async (req, res, next) => {
    const product = await products.find(
      (product) => product.id === parseInt(req.params.id)
    );
    // If the product does not exist, return an error
    if (!product) {
      return next(
        new AppError(`No product with the id of ${req.params.id}`, 404)
      );
    }
    // Remove the product from the products array
    products = products.filter(
      (product) => product.id !== parseInt(req.params.id)
    );
    // Write the new products to the json file
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
