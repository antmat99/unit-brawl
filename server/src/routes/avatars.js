/* routes for /avatars */

const express = require("express");
const router = express.Router();

const avatarController = require('../controllers/avatarController');

/* routes */

//POST shop request
router.post('/shop',avatarController.shopAvatars)


module.exports = router;