const Exception = require('../models/Exception')
const fileService = require('./fileService')
const gameService = require('./gameService')
const userDao = require('../daos/user-dao')


exports.postCoverage = async (username,coverageReport) => {
    try {
        //obtain coverage
        const coverage = fileService.getLineCoveragePercentageFromString(coverageReport)
        //update completion percentage in user_achievement_fake
        const user = await userDao.getUserByNickname(username)
        await gameService.updateCoverageAchievementsFake(user.id,coverage);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}