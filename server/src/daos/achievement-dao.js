'use strict';

const Exception = require('../models/Exception');
const db = require('../configs/db');

exports.getAchievementsByCodeStartsWith = (startsWith) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM achievement';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows.filter(row => row.code.startsWith(startsWith)));
            }
        });
    });
}

exports.updateAchievementCompletitionPercentage = (userId, achievementCode, percentage) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE user_achievement
                    SET completition_percentage = ?
                    WHERE user_id = ? AND achievement_id IN (
                        SELECT id
                        FROM achievement
                        WHERE code = ?
                    )
                        `;
        db.run(sql, [percentage, userId, achievementCode], (err, rows) => {
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

exports.getAchievementPercentageByCode = (userId, achievementCode) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
                    FROM user_achievement
                    WHERE user_id = ? AND achievement_id IN (SELECT id FROM achievement WHERE code = ?)
                    `;
        db.get(sql, [userId, achievementCode], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row.completition_percentage);
            }
        });
    });
}

exports.getAllAchievements = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM achievement';
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

exports.addUserAchievement = (userId, achievementId, percentage) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user_achievement(user_id,achievement_id,completition_percentage) VALUES(?,?,?)';
        db.run(sql, [userId, achievementId, percentage], (err, rows) => {
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

exports.clearAchievementFake = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM user_achievement_fake';
        db.run(sql, [], (err, rows) => {
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

exports.getUncompletedCoverageAchievements = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT user_achievement.user_id,user_achievement.achievement_id,user_achievement.completition_percentage,achievement.code FROM user_achievement,achievement WHERE user_id = ? AND completition_percentage != 100 AND user_achievement.achievement_id = achievement.id';
        db.all(sql, [userId], (err, rows) => {
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

exports.addUserAchievementFake = (userId, achievementId, percentage, achievementCode) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user_achievement_fake(user_id,achievement_id,completition_percentage,achievement_code) VALUES(?,?,?,?)';
        db.run(sql, [userId, achievementId, percentage, achievementCode], (err, rows) => {
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

exports.updateAchievementFakeCompletitionPercentage = (userId, achievementCode, percentage) => {
    console.log(userId)
    console.log(achievementCode)
    console.log(percentage)
    return new Promise((resolve, reject) => {
        const sql = `UPDATE user_achievement_fake
                    SET completition_percentage = ?
                    WHERE user_id = ? AND achievement_id IN (
                        SELECT id
                        FROM achievement
                        WHERE code = ?
                    )
                        `;
        db.all(sql, [percentage, userId, achievementCode], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows)
            }
        });
    });
}