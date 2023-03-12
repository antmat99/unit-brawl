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