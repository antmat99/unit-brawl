/* routes for /leaderboard */

const express = require("express");
const router = express.Router();

const leaderboardController = require('../controllers/leaderboardController')

/* routes */

router.get('/region',leaderboardController.getGlobalRegionLeaderboard)

router.get('/:quantity',leaderboardController.getGlobalLeaderboard);

module.exports = router;