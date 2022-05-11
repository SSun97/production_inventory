const express = require('express');
const { getOverview, getAddProductForm } = require('../controllers/viewsController');
const router = express.Router();
// create route
router.route('/').get(getOverview);
router.get('/addProduct', getAddProductForm);
module.exports = router;