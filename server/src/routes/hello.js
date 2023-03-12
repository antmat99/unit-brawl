const express = require("express");
const isLoggedIn = require("../middlewares/login");
const router = express.Router();

const gitlabService = require('../services/gitlabService')
const gameService = require('../services/gameService')

router.get('/', (req,res) => {
    gameService.testFinalProcess();
    res.end();
})

module.exports = router;