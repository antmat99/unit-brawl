const express = require("express");
const isLoggedIn = require("../middlewares/login");
const router = express.Router();
const labController = require('../controllers/labController')

const gitlabService = require('../services/gitlabService')
const gameService = require('../services/gameService')

router.get('/', (req,res) => {
    gameService.testFinalProcess(req.query.labId);
    res.end();
})

router.get('/test', labController.test)

module.exports = router;