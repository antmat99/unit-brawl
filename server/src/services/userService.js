const userDao = require('../daos/user-dao');
const labDao = require('../daos/lab-dao');
const avatarDao = require('../daos/avatar-dao');
const userLabDao = require('../daos/user-lab-dao');
const achievementDao = require('../daos/achievement-dao');
const { defaultAvatarId, initialMoney } = require('../configs/parameters')


const Result = require('../models/Result')
const Exception = require('../models/Exception')

exports.getUserResultList = async (userId) => {
    try {
        return await userDao.getUserLabByUserId(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserAvatarList = async (userId) => {
    try {
        return await userDao.getUserAvatarList(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserAvatarNotList = async (userId) => {
    try {
        return await userDao.getUserAvatarNotList(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserName = async (userId) => {
    try {
        return await userDao.getUserName(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserSurname = async (userId) => {
    try {
        return await userDao.getUserSurname(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserAchievementList = async (userId) => {
    try {
        return await userDao.getUserAchievementList(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserMoney = async (userId) => {
    try {
        return await userDao.getUserMoney(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserAchievementNumber = async (userId) => {
    try {
        return await userDao.getUserAchievementNumber(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}


exports.getGlobalLeaderboardWithPositions = async () => {
    try {
        const leaderboard = await userDao.getGlobalLeaderboardWithPositions(); //id,nickname,points,avatar_selected_id,position
        return await Promise.all(leaderboard.map(async row => {
            const avatar = await avatarDao.getAvatarById(row.avatar_selected_id);
            return new Result(
                '',
                true,
                row.points,
                row.position,
                row.nickname,
                avatar.image_path
            )
        }))
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getGlobalLeaderboard = async () => {
    try {
        return await userLabDao.getGlobalLeaderboard()
    } catch(e) {
        throw new Exception(500, e.message)
    }
}

exports.getGlobalLeaderboardWithPositionsQuantity = async (quantity) => {
    try {
        const fullLeaderboard = await userDao.getGlobalLeaderboardWithPositions(); //id,nickname,points,avatar_selected_id,position
        const leaderboard = fullLeaderboard.slice(0, quantity);
        return await Promise.all(leaderboard.map(async row => {
            const avatar = await avatarDao.getAvatarById(row.avatar_selected_id);
            return new Result(
                '',
                true,
                row.points,
                row.position,
                row.nickname,
                avatar.image_path
            )
        }))
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserLabsAttended = async (userId) => {
    try {
        return await userDao.getUserLabsAttended(userId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserLabRegionLeaderboard = async (userId, labId) => {
    try {
        const activeLab = await labDao.getActiveLab()
        //if(activeLab.id == labId) throw new Exception(400,'This lab is active');
        const user = await userDao.getUserById(userId)
        const fullLeaderboard = await labDao.getLabLeaderboard(labId);
        const leaderboard = []
        fullLeaderboard.every((row, index) => {
            if (row.username == user.nickname) {
                if (index - 1 >= 0) leaderboard.push(fullLeaderboard[index - 1])
                leaderboard.push(fullLeaderboard[index])
                if (index + 1 < fullLeaderboard.length) leaderboard.push(fullLeaderboard[index + 1])
                return false;
            }
            return true;
        });
        if (leaderboard.length != 0) return leaderboard;
        throw new Exception(404, "User didn't take part to this lab.")
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message);
        throw new Exception(500, e.message)
    }
}

exports.getGlobalRegionLeaderboard = async (userId) => {
    const user = await userDao.getUserById(userId)
    const fullLeaderboard = await userDao.getGlobalLeaderboardWithPositionsAvatarUrl();
    const leaderboard = []
    fullLeaderboard.every((row, index) => {
        if (row.nickname == user.nickname) {
            if (index - 1 >= 0) {
                //change property 'nickname' to 'username' and push
                const p = fullLeaderboard[index - 1]
                p.username = p.nickname
                delete p.nickname
                leaderboard.push(p)
            }
            //change property 'nickname' to 'username' and push
            const p = fullLeaderboard[index]
            p.username = p.nickname
            delete p.nickname
            leaderboard.push(p)
            if (index + 1 < fullLeaderboard.length) {
                //change property 'nickname' to 'username' and push
                const p = fullLeaderboard[index + 1]
                p.username = p.nickname
                delete p.nickname
                leaderboard.push(p)
            }
            return false;
        }
        return true;
    });
    if (leaderboard.length == 0) throw new Exception(404, "User has got no points.")
    return leaderboard;

}

exports.registerUser = async (user) => {
    try {
        if (user.nickname === 'admin')
            throw new Exception(400, "Your username must be differend from 'admin'.")
        if (await userDao.getNickname(user.nickname) !== undefined)
            throw new Exception(400, "This username has already been chosen.")
        if (await userDao.getEmail(user.email) !== undefined)
            throw new Exception(400, "This email has already been chosen.")
        const userId = await userDao.addUser(
            user.nickname,
            user.password,
            user.name,
            user.surname,
            0,
            initialMoney,
            defaultAvatarId,
            user.email
        );
        await userDao.addUserAvatar(userId, defaultAvatarId);
        //initialize achievements
        const achievements = await achievementDao.getAllAchievements();
        for (let achievement of achievements)
            await achievementDao.addUserAchievement(userId, achievement.id, 0)
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message);
        throw new Exception(500, e.message);
    }
}

exports.getUserLabRepositoryLink = async (userId, labId) => {
    try {
        return await userLabDao.getUserLabRepositoryLink(userId, labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserLabCredentials = async (userId, labId) => {
    try {
        return await userLabDao.getUserLabCredentials(userId, labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.updateUserLabRepositoryLink = async (userId, labId, link) => {
    var l = link
    try {
        if(l === '') {
            console.log('Link is empty, updating to current')
            l = await userLabDao.getUserLabRepositoryLink(userId, labId)
        }
        return await userLabDao.updateUserLabRepositoryLink(userId, labId, l);

    } catch (e) {
        throw new Exception(500, e.message)
    }
}

const isValidGitRepo = (repoLink) => {
    try {
        e.execSync(`git ls-remote ${repoLink}`);
        return true;
    } catch (error) {
        return false;
    }
}

exports.updateUserAvatarSelected = async (userId, avatarId) => {
    try {
        //TODO check if user owns avatarId
        return await userDao.updateUserAvatarSelected(userId, avatarId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserAvatarSelected = async (userId) => {
    try {
        //TODO check if user owns avatarId
        const avatarId = await userDao.getUserAvatarSelectedId(userId);
        const avatar = await avatarDao.getAvatarById(avatarId);
        console.log(avatar)
        return avatar;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.isUserJoinedActiveLab = async (userId) => {
    try {
        const activeLab = await labDao.getActiveLab();
        if (activeLab.length == 0) return false;
        const userLab = await userLabDao.getUserLabByUserIdLabId(userId, activeLab[0].id);
        return userLab.length != 0;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}