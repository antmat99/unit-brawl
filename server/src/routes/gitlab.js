const express = require("express");
const router = express.Router();

const gitlabController = require('../controllers/gitlabController');



/* /admin/labs */ 

router.post('/coverage/:username',gitlabController.postCoverage)


module.exports = router;