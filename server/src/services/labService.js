const labDao = require('../daos/lab-dao');
const userDao = require('../daos/user-dao');
const userLabDao = require('../daos/user-lab-dao');
const achievementDao = require('../daos/achievement-dao');
const LabAdmin = require('../models/LabAdmin')
const Lab = require('../models/Lab')
const Exception = require('../models/Exception')
const Result = require('../models/Result')
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat)

exports.getAllLabs = async (userId) => {
    try {
        const labs = await labDao.getAllLabs();
        const res = await Promise.all(labs.map(async lab => {
            const result = await userDao.getUserLabByUserIdLabId(userId, lab.id);
            const fullLeaderboard = await labDao.getLabLeaderboard(lab.id);
            const leaderboard = fullLeaderboard.slice(0, 10);
            return new Lab(
                lab.id,
                lab.name,
                lab.expiration_date,
                lab.trace,
                !lab.active,
                leaderboard,
                (result != undefined) ?
                    {
                        labName: result.labName,
                        completed: true,
                        points: result.points,
                        position: result.position,
                        username: undefined,
                        userAvatarLink: undefined
                    }
                    :
                    undefined,
                (result != undefined) ? result.nickname : ''
            )
        }))
        return res;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getAllLabsWithIdealSolution = async () => {
    try {
        const labs = await labDao.getAllLabsWithIdealSolution()
        const res = await Promise.all(labs.map(async lab => {
            const leaderboard = await getLabLeaderboardAdmin(lab.id);
            return new LabAdmin(
                lab.id,
                lab.name,
                lab.expiration_date,
                lab.trace,
                !lab.active,
                leaderboard,
                lab.test_max_number,
                lab.solution_repository
            )
        }))
        console.log(res)
        return res;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getLabLeaderboardAdmin = async (labId) => {
    try {
        return await getLabLeaderboardAdmin(labId)
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getLabLeaderboard = async (labId, positions) => {
    try {
        return await labDao.getLabLeaderboard(labId, positions);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

const getLabLeaderboardAdmin = async (labId) => {
    try {
        return await labDao.getLabLeaderboardAdmin(labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.createLab = async (lab) => {
    try {
        //TODO it should be atomic
        const id = await labDao.createLab(lab);
        await labDao.insertLabIdealSolution(id, lab.linkToIdealSolution);
        await achievementDao.clearAchievementFake();
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getActiveLab = async () => {
    try {
        const ret = await labDao.getActiveLab();
        if (ret.length == 0) throw (new Exception(404, 'No active labs found.'));
        if (ret.length > 1) throw (new Exception(500, 'Database error: there should be at most one active lab, but found ' + ret.length + '.'));
        return ret[0];
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.updateLab = async (lab) => {
    try {
        //TODO it should be atomic
        await labDao.updateLab(lab);
        await labDao.updateLabLinkToIdealSolution(lab);
        let ret = await labDao.getLabByIdAdmin(lab.id);
        const leaderboard = await getLabLeaderboardAdmin(lab.id)
        ret['leaderboard'] = leaderboard;
        return ret;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.deleteLab = async (labId) => {
    try {
        //TODO it should be atomic
        await labDao.deleteLabIdealSolution(labId);
        await labDao.deleteLab(labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.stopLab = async (labId) => {
    try {
        if (await labDao.getLabByIdAdmin(labId) == undefined) throw new Exception(404, 'No lab found for id ' + labId)
        return await labDao.setActive(labId, false);
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.getLabByIdAdmin = async (labId) => {
    try {
        const ret = await labDao.getLabByIdAdmin(labId);
        if (ret == undefined) throw new Exception(404, 'No lab found for id ' + labId);
        const leaderboard = await getLabLeaderboardAdmin(labId);
        return new LabAdmin(
            ret.id,
            ret.name,
            ret.expiration_date,
            ret.trace,
            !ret.active,
            leaderboard,
            ret.test_max_number,
            ret.solution_repository
        );
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.getLabPlayersCount = async (labId) => {
    try {
        if (await labDao.getLabByIdAdmin(labId) == undefined) throw new Exception(404, 'No lab found for id ' + labId)
        const ret = await labDao.getLabPlayersCount(labId);
        return ret;
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.joinLab = async (userId,repositoryLink) => {
    try {
        const activeLab = await labDao.getActiveLab();
        if (activeLab.length == 0) throw (new Exception(404, 'No active labs found.'));
        if (activeLab.length > 1) throw (new Exception(500, 'Database error: there should be at most one active lab, but found ' + ret.length + '.'));
        const ret = await userLabDao.insertUserLab(userId,activeLab[0].id,repositoryLink);
        //initialize coverage achievements
        const uncompletedCoverageAchievements = await achievementDao.getUncompletedCoverageAchievements(userId);
        for(let achievement of uncompletedCoverageAchievements){
            await achievementDao.addUserAchievementFake(userId,achievement.achievement_id,0,achievement.code);
        }
        return ret;
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)    }
}

exports.stopLabIfExpired = () => {
    try {
        labDao.stopLabIfExpired(dayjs().format('DD-MM-YYYY'));
    } catch (e) {
        //handle error
    }
}
