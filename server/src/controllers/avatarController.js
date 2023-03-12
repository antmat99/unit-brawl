const avatarService = require('../services/avatarService');


exports.shopAvatars = async (req, res) => {
    try {
        const ret = await avatarService.shopAvatars(req.body.avatarIdList,req.user.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.getAvatarList = async (req, res) => {
    try {
        const ret = await avatarService.getAvatarList()
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.deleteAvatar = async (req, res) => {
    try {
        await avatarService.deleteAvatar(req.params.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).end();
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const ret = await avatarService.updateAvatar(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.createAvatar = async (req, res) => {
    try {
        const ret = await avatarService.createAvatar(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};