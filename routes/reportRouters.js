const { createReportCSV, downloadReport } = require('../controllers/reportController');
const express = require('express');


const router = express.Router();
// create route
router.route('/').get(createReportCSV, downloadReport);
module.exports = router;
