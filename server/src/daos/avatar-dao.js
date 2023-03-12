'use strict';

const Exception = require('../models/Exception');
const db = require('../configs/db');

exports.getAvatarList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM avatar';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.deleteAvatar = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM avatar WHERE id=?';
        db.run(sql, [id], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.updateAvatar = (avatar) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE avatar SET name=?, description=?, price=?, image_path=? WHERE id=?';
        db.run(sql, [avatar.name,avatar.description,avatar.price,avatar.imagePath,avatar.id], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row);
            }
        });
    });
}

exports.createAvatar = (avatar) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO avatar(id,name,description,price,image_path) VALUES(?,?,?,?,?)';
        db.run(sql, [avatar.id,avatar.name,avatar.description,avatar.price,avatar.imagePath], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row);
            }
        });
    });
}

exports.getAvatarById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM avatar WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row);
            }
        });
    });
}