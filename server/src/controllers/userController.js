const userService = require('../services/userService');
const userDao = require('../daos/user-dao');

//GET list of results of user
exports.getUserResultList = async (req, res) => {
    try {
        const ret = await userService.getUserResultList(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

//GET list of avatars owned by user 
exports.getUserAvatarList = async (req, res) => {
    try {
        const ret = await userService.getUserAvatarList(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

//GET list of avatars NOT owned by user 
exports.getUserAvatarNotList = async (req, res) => {
    try {
        const ret = await userService.getUserAvatarNotList(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

//GET name for user 
exports.getUserName = async (req, res) => {
    try {
        const result = await userDao.getUserName(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        res.status(e.code).end(e.message);
    }

};

//GET surname for user 
exports.getUserSurname = async (req, res) => {
    try {
        const result = await userDao.getUserSurname(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

//GET nickname for user 
exports.getUserNickname = async (req, res) => {
    try {
        //TODO take from logged user
        const result = await userDao.getUserNickname(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

//GET list of achievements for user 
exports.getUserAchievementList = async (req, res) => {
    try {
        const result = await userDao.getUserAchievementList(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

//GET list of achievements fake for user 
exports.getUserAchievementFakeList = async (req, res) => {
    try {
        const result = await userDao.getUserAchievementFakeList(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

//GET money quantity for user username
exports.getUserMoneyNumber = async (req, res) => {
    try {
        const result = await userDao.getUserMoney(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

//GET number of unlocked achievements for user username
exports.getUserAchievementNumber = async (req, res) => {
    try {
        const result = await userDao.getUserAchievementNumber(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.getGlobalLeaderboard = async (req, res) => {
    try {
        const result = await userService.getGlobalLeaderboardWithPositions();
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.getUserLabsAttended = async (req, res) => {
    try {
        const ret = await userService.getUserLabsAttended(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.getUserLabRegionLeaderboard = async (req, res) => {
    try {
        //TODO take user id from logged user
        const result = await userService.getUserLabRegionLeaderboard(req.user.id,req.query.labId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.getUserLabRepositoryLink = async (req, res) => {
    try {
        const result = await userService.getUserLabRepositoryLink(req.user.id,req.query.labId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.getUserLabCredentials = async (req, res) => {
    try {
        const result = await userService.getUserLabCredentials(req.user.id,req.query.labId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.updateUserLabRepositoryLink = async (req, res) => {
    try {
        const result = await userService.updateUserLabRepositoryLink(req.user.id, req.query.labId, req.body.link);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.updateUserAvatarSelected = async (req, res) => {
    try {
        const result = await userService.updateUserAvatarSelected(req.user.id,req.body.avatarId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.getUserAvatarSelected = async (req, res) => {
    try {
        const result = await userService.getUserAvatarSelected(req.user.id);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.isUserJoinedActiveLab = async (req, res) => {
    try {
        const ret = await userService.isUserJoinedActiveLab(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};