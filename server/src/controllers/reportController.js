const reportService = require('../services/reportService');

exports.getGeneralReport = async (req, res) => {
    try {
        const ret = await reportService.getGeneralReport();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}; 

exports.getLabsReport = async (req, res) => {
    try {
        const ret = await reportService.getLabsReport();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}; 

exports.getUsersReport = async (req, res) => {
    try {
        const ret = await reportService.getUsersReport();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}; 

exports.getUserLabsReport = async (req, res) => {
    try {
        const ret = await reportService.getUserLabsReport();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ret);
    } catch (e) {
        res.status(e.code).end(e.message)
    }
}; 