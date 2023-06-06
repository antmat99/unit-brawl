const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.get('/', gameController.startWar)

module.exports = router; 