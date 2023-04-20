const LabAdmin = require('../models/LabAdmin');
const labService = require('../services/labService');

exports.getAllLabs = async (req, res) => {
    try {
        const ret = await labService.getAllLabs(req.user.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}; 

exports.getAllLabsAdmin = async (req, res) => {
    //lab + link to ideal solution
    try {
        const ret = await labService.getAllLabsWithIdealSolution();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.getLeaderboardAdmin = async (req, res) => {
    try {
        const ret = await labService.getLabLeaderboardAdmin(req.params.id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};


exports.createAndStartLab = async (req, res) => {
    try {
        const lab = req.body
        delete lab.id
        const ret = await labService.createLab(lab);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.getActiveLab = async (req, res) => {
    try {
        const ret = await labService.getActiveLab()
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.updateLab = async (req, res) => {
    try {
        const ret = await labService.updateLab(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.deleteLab = async (req, res) => {
    try {
        const ret = await labService.deleteLab(req.params.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.stopLab = async (req, res) => {
    try {
        const ret = await labService.stopLab(req.params.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.getLabByIdAdmin = async (req, res) => {
    try {
        const ret = await labService.getLabByIdAdmin(req.params.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}

exports.getLabPlayersCount = async (req, res) => {
    try {
        const ret = await labService.getLabPlayersCount(req.params.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}


exports.joinLab = async (req, res) => {
    try {
        const ret = await labService.joinLab(req.user.id,req.body.repositoryLink);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.checkProgress = async (req, res) => {
    try {
        // TODO: get actual repo links
        const result = await labService.checkProgress()
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch(e) {
        res.status(e.code).end(e.message)
    }
}

exports.checkSolutionCompiles = async (req, res) => {
    try {
        const report = await labService.checkSolutionCompiles(req.body.repositoryLink)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(report)
    } catch(e) {
        res.status(e.code).end(e.message)
    }
}

exports.getTestsReport = async (req, res) => {
    try {
        // TODO use user's repo link
        const report = await labService.getTestsReport('https://gitlab.com/matteofavretto/mountain-huts.git');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(report)
    } catch(e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
}