const { getReportCSV } = require('../controllers/reportController');
const express = require('express');

const router = express.Router();
router.route('/').get(getReportCSV);
module.exports = router;
