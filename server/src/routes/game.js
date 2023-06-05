const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.post('/', gameController.startWar)

module.exports = router; 