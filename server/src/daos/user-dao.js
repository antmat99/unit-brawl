'use strict';

const Exception = require('../models/Exception');

const db = require('../configs/db');

//login
exports.getUser = (nickname, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE nickname = ?';
        db.get(sql, [nickname], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = { id: row.id, username: row.nickname, email: row.email };
                if (row.password !== password) resolve(false)
                else resolve(user);
            }
        })
    })
}

//login
exports.getAdmin = (nickname, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admin WHERE nickname = ?';
        db.get(sql, [nickname], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = { id: row.id, username: row.nickname };
                if (row.password !== password) resolve(false)
                else resolve(user);
            }
        })
    })
}

exports.getAdminById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admin WHERE id=?';
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


exports.getUserLabByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT user.nickname, lab.name as labName, user_lab.points, user_lab.position
                    FROM user_lab, user, lab
                    WHERE user.id=? AND user.id = user_lab.user_id AND user_lab.lab_id = lab.id
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log('getUserLabByUserId: ' + err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.getUserLabByUserIdLabId = (userId, labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT user.nickname, lab.name as labName, user_lab.points, user_lab.position
                    FROM user_lab, user, lab
                    WHERE user.id=? AND lab.id = ?AND user.id = user_lab.user_id AND user_lab.lab_id = lab.id
                    `;
        db.get(sql, [userId, labId], (err, row) => {
            if (err) {
                console.log('getUserLabByUserId: ' + err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row);
            }
        });
    });
}


exports.getUserAvatarList = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT avatar.id, avatar.name, avatar.description, avatar.image_path AS imagePath, avatar.price
                    FROM user_avatar, avatar
                    WHERE user_avatar.user_id=? AND user_avatar.avatar_id = avatar.id
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.getUserAvatarIdList = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT avatar.id
                    FROM user_avatar, avatar
                    WHERE user_avatar.user_id=? AND user_avatar.avatar_id = avatar.id
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(rows);
            }
        });
    });
}


exports.getUserAvatarNotList = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT avatar.id, avatar.name, avatar.description, avatar.image_path AS imagePath, avatar.price
                    FROM avatar
                    WHERE avatar.id NOT IN(
                        SELECT avatar_id
                        FROM user_avatar
                        WHERE user_avatar.user_id=? 
                    )
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.getUserName = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(row.name);
            }
        });
    });
};


exports.getUserSurname = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT surname FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(row.surname);
            }
        });
    });
};

exports.getUserNickname = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nickname FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(row.nickname);
            }
        });
    });
};

exports.getNicknameById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nickname FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(row.nickname);
            }
        });
    });
};


exports.getUserAchievementList = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT achievement.name, achievement.description, achievement.badge_path, user_achievement.completition_percentage, achievement.code
                    FROM achievement, user_achievement
                    WHERE achievement.id = user_achievement.achievement_id AND user_achievement.user_id = ?
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                const result = rows.map(element => ({
                    name: element.name,
                    description: element.description,
                    completed: element.completition_percentage == 100,
                    badgeImagePath: element.badge_path,
                    completitionPercentage: element.completition_percentage,
                    code: element.code
                }))
                resolve(result);
            }
        });
    });
}


exports.getUserAchievementFakeList = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT achievement.name, achievement.description, achievement.badge_path, user_achievement_fake.completition_percentage, achievement.code
                    FROM achievement, user_achievement_fake
                    WHERE achievement.id = user_achievement_fake.achievement_id AND user_achievement_fake.user_id = ?
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                const result = rows.map(element => ({
                    name: element.name,
                    description: element.description,
                    completed: element.completition_percentage == 100,
                    badgeImagePath: element.badge_path,
                    completitionPercentage: element.completition_percentage,
                    code: element.code
                }))
                resolve(result);
            }
        });
    });
}


exports.getUserMoney = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT money FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(row.money);
            }
        });
    });
};


exports.getUserAchievementNumber = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) FROM user_achievement WHERE user_id=? and completition_percentage=100';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (row == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                console.log(row)
                resolve(row['COUNT(*)']);
            }
        });
    });
};

exports.countAll = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) FROM user`;
        db.get(sql, [], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row["COUNT(*)"]);
            }
        });
    });
}

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user`;
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

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
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

exports.getGlobalLeaderboardWithPositions = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, nickname, total_points as points, avatar_selected_id,
                DENSE_RANK () OVER (
                    ORDER BY total_points DESC
                ) position
            FROM user
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
};

exports.getGlobalLeaderboardWithPositionsAvatarUrl = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.id, u.nickname, u.total_points as points, u.avatar_selected_id, a.image_path as userAvatarLink,
                DENSE_RANK () OVER (
                    ORDER BY total_points DESC
                ) position
            FROM user u, avatar a
            WHERE a.id = u.avatar_selected_id
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
};

exports.shopAvatar = (userId, avatarId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_avatar(user_id,avatar_id)
            VALUES(?,?)
        `;
        db.run(sql, [userId, avatarId], (err, row) => {
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

exports.decreaseMoney = (userId, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user SET money = money - ? WHERE id = ?
        `;
        db.run(sql, [quantity, userId], (err, row) => {
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


exports.getUserLabsAttended = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT lab_id
                    FROM user_lab
                    WHERE user_id = ?
                    `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else if (rows == undefined) {
                reject(new Exception(404, 'User not found'));
            }
            else {
                resolve(rows);
            }
        });
    });
}

exports.getNickname = (nickname) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE nickname=?';
        db.get(sql, [nickname], (err, row) => {
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

exports.getEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email=?';
        db.get(sql, [email], (err, row) => {
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

exports.shopAvatar = (userId, avatarId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_avatar(user_id,avatar_id)
            VALUES(?,?)
        `;
        db.run(sql, [userId, avatarId], (err, row) => {
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

exports.addUser = (nickname,password,name,surname,points,money,avatarId,email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user(id,nickname,password,name,surname,total_points,money,avatar_selected_id,email)
            VALUES(?,?,?,?,?,?,?,?,?)
        `;
        db.run(sql, [undefined,nickname,password,name,surname,points,money,avatarId,email], function(err) {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(this.lastID);
            }
        });
    });
};

exports.addUserAvatar = (userId,avatarId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_avatar(user_id,avatar_id)
            VALUES(?,?)
        `;
        db.run(sql, [userId,avatarId], (err, row) => {
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

exports.updateUserAvatarSelected = (userId,avatarId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user 
            SET avatar_selected_id = ?
            WHERE id = ?
        `;
        db.run(sql, [avatarId,userId], (err, row) => {
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

exports.getUserAvatarSelectedId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT avatar_selected_id FROM user WHERE id=?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row.avatar_selected_id);
            }
        });
    });
};

exports.addPoints = (userId,points) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user 
            SET total_points = total_points + ?
            WHERE id = ?
        `;
        db.run(sql, [points,userId], (err, row) => {
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

//login
exports.getUserByNickname = (nickname) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE nickname = ?';
        db.get(sql, [nickname], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                resolve(row)
            }
        })
    })
}

exports.addMoney = (userId, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user SET money = money + ? WHERE id = ?
        `;
        db.run(sql, [quantity, userId], (err, row) => {
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