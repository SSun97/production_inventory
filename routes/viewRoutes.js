const express = require('express');
const { getOverview, getAddProductForm, getUpdateProductForm,deleteProduct } = require('../controllers/viewsController');
const router = express.Router();
// create route
router.route('/').get(getOverview);
router.get('/addProduct', getAddProductForm);
router.get('/deleteProduct/:id', deleteProduct);
router.get('/updateProduct', getAddProductForm);
module.exports = router;