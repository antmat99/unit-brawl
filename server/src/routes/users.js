/* routes for /users */

const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const labController = require('../controllers/labController')
 
/* routes */

//GET list of results for user 
router.get('/results',userController.getUserResultList)

//GET list of avatars owned by user 
router.get('/avatars',userController.getUserAvatarList)

//GET list of avatars NOT owned by user 
router.get('/avatars/not',userController.getUserAvatarNotList)

//GET
router.get('/avatars/selected',userController.getUserAvatarSelected)

//PUT
router.put('/avatars/selected',userController.updateUserAvatarSelected)

//GET name for user 
router.get('/name',userController.getUserName)

//GET surname for user 
router.get('/surname',userController.getUserSurname)

//GET nickname for user 
router.get('/nickname',userController.getUserNickname)

//GET list of achievements for user 
router.get('/achievements',userController.getUserAchievementList)

//GET list of fake achievements (about coverage)
router.get('/achievements/fake',userController.getUserAchievementFakeList)

//GET money quantity for user 
router.get('/money',userController.getUserMoneyNumber)

//GET number of unlocked achievements for user 
router.get('/achievements/quantity',userController.getUserAchievementNumber)

//GET list of labs attended by user
router.get('/labs',userController.getUserLabsAttended)

//return true solo se c'è un lab attivo e l'utente partecipa
router.get('/labs/active/joined',userController.isUserJoinedActiveLab)

//GET 
router.get('/labs/regionLeaderboard',userController.getUserLabRegionLeaderboard)

router.get('/labs/repositoryLink',userController.getUserLabRepositoryLink)

router.get('/labs/credentials',userController.getUserLabCredentials)

router.put('/labs/repositoryLink',userController.updateUserLabRepositoryLink)

router.get('/labs/solRepositoryLink', labController.getSolutionRepositoryLink)


module.exports = router;
