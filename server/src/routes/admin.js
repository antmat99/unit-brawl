/* routes for /admin */

const express = require("express");
const router = express.Router();

const labController = require('../controllers/labController');
const avatarController = require('../controllers/avatarController');
const reportController = require('../controllers/reportController');
const userController = require('../controllers/userController');


/* /admin/labs */ 

router.get('/labs',labController.getAllLabsAdmin)

router.post('/labs',labController.createAndStartLab)

router.get('/labs/:id/leaderboard',labController.getLeaderboardAdmin)

router.get('/labs/active',labController.getActiveLab)

router.put('/labs',labController.updateLab)

router.delete('/labs/:id',labController.deleteLab)

router.post('/labs/stop/:id',labController.stopLab)

router.get('/labs/:id',labController.getLabByIdAdmin)

router.get('/labs/:id/players/count',labController.getLabPlayersCount)


/* /admin/leaderboard */

router.get('/leaderboard',userController.getGlobalLeaderboard)


/* /admin/avatars */

router.get('/avatars',avatarController.getAvatarList)

router.delete('/avatars/:id',avatarController.deleteAvatar)

router.put('/avatars',avatarController.updateAvatar)

router.post('/avatars',avatarController.createAvatar)


/* /admin/reports */

router.get('/reports/general',reportController.getGeneralReport)

router.get('/reports/labs',reportController.getLabsReport)

router.get('/reports/users',reportController.getUsersReport)

router.get('/reports/userlabs',reportController.getUserLabsReport)


module.exports = router;