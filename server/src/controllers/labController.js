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
        const lab = req.body.lab
        const accessToken = req.body.accessToken
        const username = req.body.username
        delete lab.id
        const ret = await labService.createLab(lab, username, accessToken);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        console.log(e)
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
        const ret = await labService.updateLab(req.body.lab, req.body.username, req.body.token)
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
        const ret = await labService.joinLab(req.user.id,req.body.repositoryLink,req.body.username,req.body.accessToken);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
};

exports.getSolutionRepositoryLink = async (req, res) => {
    try {
        const result = await labService.getSolutionRepositoryLink(req.query.labId);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(e.code).end(e.message);
    }
};

exports.checkProgress = async (req, res) => {
    try {
        const result = await labService.checkProgress(req.user.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
}

exports.checkCoverage = async(req, res) => {
    try {
        const result = await labService.checkCoverage(req.user.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
}


/* Remove */
exports.test = async (req, res) => {
    try {
        const result = await labService.test(req.user.id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch(e) {
        res.status(e.code).end(e.message)
    }
}

/* Remove */
exports.checkSolutionCompiles = async (req, res) => {
    try {
        const report = await labService.checkSolutionCompiles(req.body.repositoryLink)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(report)
    } catch(e) {
        res.status(e.code).end(e.message)
    }
}

/* Remove */
exports.getTestsReport = async (req, res) => {
    try {
        const report = await labService.getTestsReport('https://gitlab.com/matteofavretto/mountain-huts.git');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(report)
    } catch(e) {
        console.log(e)
        res.status(e.code).end(e.message)
    }
}