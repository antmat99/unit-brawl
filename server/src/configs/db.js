'use strict';

const sqlite = require('sqlite3');

const dbPath = process.env.DB_PATH ? process.env.DB_PATH : './database.db'

const db = new sqlite.Database(dbPath, (err) => {
    if(err) {
        console.error('Failed to create database object: ' + err)
        process.exit(1)
    }
});

module.exports = db;