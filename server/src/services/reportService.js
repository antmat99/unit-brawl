const labDao = require('../daos/lab-dao');
const userLabDao = require('../daos/user-lab-dao');
const userDao = require('../daos/user-dao');
const Exception = require('../models/Exception')

exports.getGeneralReport = async () => {
    try {
        const labTotalNumber = await labDao.countAll();
        const userTotalNumber = await userDao.countAll();
        const labs = await labDao.getAllLabs();
        let sum = 0;
        for (let lab of labs) {
            const participants = await userLabDao.countLabParticipants(lab.id);
            sum += participants
        }
        let avgParticipantsPerLab = 0;
        if (labTotalNumber !== 0) avgParticipantsPerLab = sum / labTotalNumber;
        const labsWithoutParticipantsCount = await labDao.countLabsWithoutParticipants();
        return {
            labTotalNumber: labTotalNumber,
            userTotalNumber: userTotalNumber,
            avgParticipantsPerLab: avgParticipantsPerLab,
            labsWithoutParticipantsCount: labsWithoutParticipantsCount
        }
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getLabsReport = async () => {
    try {
        const labs = await labDao.getAllLabs()
        const ret = await Promise.all(labs.map(async lab => {
            const participants = await userLabDao.countLabParticipants(lab.id)
            const totalUsers = await userDao.countAll();
            let participantsPercentage = 0
            if(totalUsers !== 0) participantsPercentage = (participants * 100) / totalUsers
            const totalPoints = await userLabDao.sumPoints(lab.id)
            let avgPoints = 0;
            if(participants !== 0) avgPoints = totalPoints / participants
            return {
                id: lab.id,
                participants: participants,
                participantsPercentage: participantsPercentage,
                avgPoints: avgPoints
            }
        }));
        return ret;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUsersReport = async () => {
    try {
        const users = await userDao.getAllUsers();
        const ret = await Promise.all(users.map(async user => {
            const labsAttendedCount = await userLabDao.countUserLabsAttended(user.id);
            const totalLabsNumber = await labDao.countAll();
            let labsAttendedPercentage = 0;
            if(totalLabsNumber !== 0) labsAttendedPercentage = (labsAttendedCount * 100) / totalLabsNumber;
            const totalPoints = await userLabDao.getUserLabsPoints(user.id);
            let avgPoints = 0;
            if(labsAttendedCount !== 0) avgPoints = totalPoints / labsAttendedCount;
            let bestPosition = await userLabDao.getUserBestPosition(user.id);
            if(bestPosition == undefined) bestPosition = 0;
            return {
                id: user.id,
                nickname: user.nickname,
                fullName: user.name+' '+user.surname,
                labsAttendedCount: labsAttendedCount,
                labsAttendedPercentage: labsAttendedPercentage,
                avgPoints: avgPoints,
                bestPosition: bestPosition
            }
        }))
        return ret;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getUserLabsReport = async () => {
    try {
        return await userLabDao.getAll()
    } catch (e) {
        throw new Exception(500, e.message)
    }
}