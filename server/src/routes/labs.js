/* routes for /labs */

const express = require("express");
const router = express.Router();

const {isLabActive} = require('../middlewares/middlewares')

const labController = require("../controllers/labController");

/* routes */

router.get('/', labController.getAllLabs);

router.post('/join', isLabActive, labController.joinLab);

router.get('/progress', isLabActive, labController.checkProgress);

module.exports = router; 