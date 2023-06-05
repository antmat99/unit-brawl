const gameService = require('../services/gameService')

exports.startWar = async (req, res) => {
    try{
        const result = await gameService.finalProcess(req.query.labId)
        res.status(200).json(result)
    } catch(e) {
        res.status(e.code).end(e.message)
    }
}