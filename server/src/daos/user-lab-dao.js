'use strict';

const Exception = require('../models/Exception');

const db = require('../configs/db');

exports.assignPoints = (points, userId, labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET points = ? WHERE user_id = ? AND lab_id = ?';
        db.run(sql, [points, userId, labId], (err, rows) => {
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

exports.addPoints = (points, userId, labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET points = points + ? WHERE user_id = ? AND lab_id = ?';
        db.run(sql, [points, userId, labId], (err, rows) => {
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

exports.getPoints = (userId, labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT points FROM user_lab WHERE user_id = ? AND lab_id = ?';
        db.get(sql, [userId, labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row.points);
            }
        });
    });
}

exports.countAllParticipants = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(DISTINCT user_id) FROM user_lab`;
        db.get(sql, [], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row["COUNT(DISTINCT user_id)"]);
            }
        });
    });
}

exports.countLabParticipants = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(DISTINCT user_id) FROM user_lab WHERE lab_id=?`;
        db.get(sql, [labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row["COUNT(DISTINCT user_id)"]);
            }
        });
    });
}

exports.sumPoints = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT SUM(points) FROM user_lab WHERE lab_id=?`;
        db.get(sql, [labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row['SUM(points)']);
            }
        });
    });
}

exports.countUserLabsAttended = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) FROM user_lab WHERE user_id=?`;
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row['COUNT(*)']);
            }
        });
    });
}

exports.getUserLabsPoints = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT SUM(points) FROM user_lab WHERE user_id=?`;
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row['SUM(points)']);
            }
        });
    });
}

exports.getUserBestPosition = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MIN(position) FROM user_lab WHERE user_id=?`;
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row['MIN(position)']);
            }
        });
    });
}


exports.insertUserLab = (userId, labId, repositoryLink) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_lab(user_id,lab_id,points,position,repository,coverage_percentage,tests_failed_on_enemy,tests_enemy_passed)
            VALUES(?,?,0,0,?,0,0,0)
        `;
        db.run(sql, [userId, labId, repositoryLink], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row);
            }
        });
    });
};

exports.getUserLabRepositoryLink = (userId, labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT repository FROM user_lab WHERE user_id = ? AND lab_id = ?';
        db.get(sql, [userId, labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                console.log(row)
                resolve(row.repository);
            }
        });
    });
}

exports.updateUserLabRepositoryLink = (userId, labId, link) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET repository = ? WHERE user_id = ? AND lab_id = ?';
        db.get(sql, [link, userId, labId], (err, row) => {
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

exports.getUserLabAndGeneratePositionByLabId = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user_id,lab_id,
                        DENSE_RANK () OVER (
                            ORDER BY points DESC
                        ) position
                    FROM user_lab
                    WHERE lab_id = ?
         `;
        db.all(sql, [labId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                console.log(rows)
                resolve(rows);
            }
        });
    });
}

exports.updateUserLabPosition = (userId, labId, position) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET position = ? WHERE user_id = ? AND lab_id = ?';
        db.get(sql, [position, userId, labId], (err, row) => {
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

exports.getUserLabByLabId = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                    FROM user_lab
                    WHERE lab_id = ?
         `;
        db.all(sql, [labId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows.repository);
            }
        });
    });
}

exports.countUserPositionsGreaterEqual = (userId,position) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(DISTINCT lab_id) FROM user_lab WHERE user_id = ? AND position <= ?`;
        db.get(sql, [userId,position], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row["COUNT(DISTINCT lab_id)"]);
            }
        });
    });
}

exports.updateUserLabCoverage = (userId, labId, coverage) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET coverage_percentage = ? WHERE user_id = ? AND lab_id = ?';
        db.get(sql, [coverage, userId, labId], (err, row) => {
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

exports.getUserLabByUserIdLabId = (userId,labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user_lab WHERE user_id=? AND lab_id=?`;
        db.all(sql, [userId,labId], (err, rows) => {
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

exports.getUserBestCoverage = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MAX(coverage_percentage) FROM user_lab WHERE user_id=?`;
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row['MAX(coverage_percentage)']);
            }
        });
    });
}

exports.updateUserLabFailedOnEnemy = (userId, labId, number) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET tests_failed_on_enemy = tests_failed_on_enemy + ? WHERE user_id = ? AND lab_id = ?';
        db.run(sql, [number, userId, labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve();
            }
        });
    });
}

exports.updateUserLabPassedOnMine = (userId, labId, number) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user_lab SET tests_enemy_passed = tests_enemy_passed + ? WHERE user_id = ? AND lab_id = ?';
        db.run(sql, [number, userId, labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve();
            }
        });
    });
}

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                    FROM user_lab
         `;
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