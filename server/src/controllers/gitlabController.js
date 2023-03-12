const gitlabService = require('../services/gitlabService');


exports.postCoverage = async (req, res) => {
    try {
        const ret = await gitlabService.postCoverage(req.params.username,req.body)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};