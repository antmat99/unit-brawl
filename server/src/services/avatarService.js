const avatarDao = require('../daos/avatar-dao');
const userDao = require('../daos/user-dao');
const Exception = require('../models/Exception')

exports.getAvatarList = async () => {
    try {
        return await avatarDao.getAvatarList();
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.deleteAvatar = async (id) => {
    try {
        await avatarDao.deleteAvatar(id);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.updateAvatar = async (avatar) => {
    try {
        return await avatarDao.updateAvatar(avatar);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.createAvatar = async (avatar) => {
    try {
        delete avatar.id
        return await avatarDao.createAvatar(avatar);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.shopAvatars = async (avatarIdList,userId) => {
    //TODO insert operations should be atomic
    try {
        //checks
        let totalPrice = 0;
        for(let avatarId of avatarIdList){
            const avatar = await avatarDao.getAvatarById(avatarId);
            if(avatar == undefined) throw new Exception(404,'Found no avatar for id '+avatarId+'.');
            const userAvatarsIdList = await userDao.getUserAvatarList(userId)
            if(userAvatarsIdList.includes(avatarId)) throw new Exception(400,'User already has avatar'+avatarId+'.');
            totalPrice += avatar.price;
        }
        const userMoney = await userDao.getUserMoney(userId);
        if(totalPrice > userMoney) throw new Exception(400,'Not enough money.');
        //all right, shop
        for(let avatarId of avatarIdList){
            const avatar = await avatarDao.getAvatarById(avatarId);
            await userDao.shopAvatar(userId,avatarId);
            await userDao.decreaseMoney(userId,avatar.price)
        }
    } catch (e) {
        if(e.code !== 500) throw new Exception(e.code,e.message);
        throw new Exception(500, e.message)
    }
}

