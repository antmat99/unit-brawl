const express = require("express");
const router = express.Router();
const loginController = require('../controllers/loginController')

router.post('/',loginController.login)

router.get('/current',loginController.getSession)

router.delete('/current',loginController.logout)

router.post('/register',loginController.register)

module.exports = router