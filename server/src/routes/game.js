const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const labController = require('../controllers/labController')

router.get('/', gameController.startWar)

router.get('/war-done', labController.hasWarAlreadyHappened)
router.get('/leaderboard', labController.getLabLeaderboard)

module.exports = router; 