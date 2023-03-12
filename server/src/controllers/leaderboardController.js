const userService = require('../services/userService');



exports.getGlobalLeaderboard = async (req,res) => {
    try {
        const ret = await userService.getGlobalLeaderboardWithPositionsQuantity(req.params.quantity);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
};

exports.getGlobalRegionLeaderboard = async (req,res) => {
    try {
        const ret = await userService.getGlobalRegionLeaderboard(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
};

