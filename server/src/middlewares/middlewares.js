
const cors = require('cors');
const labDao = require('../daos/lab-dao')


const morgan = require('morgan'); // logging middleware
const { format } = require('morgan');

const { check, validationResult } = require('express-validator'); // validation middleware

const { json } = require('express');

const isLabActive = async (req,res,next) => {
    const activeLab = await labDao.getActiveLab();
    if(activeLab.length != 0) return next();
    return res.status(400).json({ error: 'No active lab found.' });
}

module.exports = {isLabActive,cors,morgan}
