'use strict';

const Exception = require('../models/Exception');

const db = require('../configs/db');
const Result = require('../models/Result');

exports.getAllLabs = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM lab';
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

exports.getAllLabsWithIdealSolution = () => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT l.id, l.name, l.trace, l.expiration_date, l.active, l.test_max_number, li.solution_repository
                    FROM lab l, lab_ideal_solution li 
                    WHERE l.id = li.lab_id
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

exports.getUserLabListByLabId = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user_lab WHERE lab_id=?';
        db.all(sql, [labId], (err, rows) => {
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

exports.getLinkToIdealSolution = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT solution_repository FROM lab_ideal_solution WHERE lab_id=?';
        db.get(sql, [labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row.solution_repository);
            }
        });
    });
}

exports.getTestMaxNumber = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT test_max_number FROM lab WHERE id=?';
        db.get(sql, [labId], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row.test_max_number);
            }
        });
    });
}


exports.setActive = (labId, active) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE lab SET active = ? WHERE id=?';
        db.run(sql, [active, labId], (err, row) => {
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

exports.getLabLeaderboardAdmin = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT l.name, ul.points, ul.position, u.nickname, a.image_path
                    FROM user_lab ul, lab l, user u, avatar a
                    WHERE ul.lab_id=? AND l.id=ul.lab_id AND u.id=ul.user_id AND u.avatar_selected_id=a.id
                    ORDER BY points DESC
                    `;
        db.all(sql, [labId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                const res = rows.map(row => {
                    return new Result(row.name, true, row.points, row.position, row.nickname, row.image_path)
                })
                resolve(res);
            }
        });
    });
}

exports.getLabLeaderboard = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT l.name, ul.points, ul.position, u.nickname, a.image_path
                    FROM user_lab ul, lab l, user u, avatar a
                    WHERE lab_id=? AND l.id = ul.lab_id AND u.id = ul.user_id AND u.avatar_selected_id = a.id
                    ORDER BY points DESC
                    `;
        db.all(sql, [labId], (err, rows) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(rows.map(row => {
                    return new Result(row.name, true, row.points, row.position, row.nickname, row.image_path)
                }));
            }
        });
    });
}

exports.createLab = (lab) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    INSERT INTO lab(id,name,trace,expiration_date,active,test_max_number)
                    VALUES(?,?,?,?,?,?)
                    `;
        db.run(sql, [lab.id,lab.name,lab.trace,lab.deadline,true,lab.testMaxNumber], function (err) {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            resolve(this.lastID);
        });
    });
}

exports.insertLabIdealSolution = (id,linkToIdealSolution) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    INSERT INTO lab_ideal_solution(lab_id,solution_repository)
                    VALUES(?,?)
                    `;
        db.run(sql, [id,linkToIdealSolution], function (err) {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
                resolve(this.lastId);
        });
    });
}

exports.getActiveLab = () => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT *
                    FROM lab
                    WHERE active = 1
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

exports.updateLab = (lab) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    UPDATE lab
                    SET name = ?, trace = ?, expiration_date = ?, active = ?, test_max_number = ?
                    WHERE id=?
                    `;
        db.run(sql, [lab.name,lab.trace,lab.deadline,!lab.expired,lab.testMaxNumber,lab.id], (err, row) => {
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

exports.updateLabLinkToIdealSolution = (lab) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    UPDATE lab_ideal_solution
                    SET solution_repository = ?
                    WHERE lab_id=?
                    `;
        db.run(sql, [lab.linkToIdealSolution,lab.id], (err, row) => {
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

exports.getLabByIdAdmin = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT l.id, l.name, l.trace, l.expiration_date, l.active, l.test_max_number, li.solution_repository
                    FROM lab l, lab_ideal_solution li
                    WHERE l.id=? AND l.id = li.lab_id
                    `;
        db.get(sql, [labId], (err, row) => {
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

exports.deleteLab = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    DELETE FROM lab
                    WHERE id=?
                    `;
        db.run(sql, [labId], (err, row) => {
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

exports.deleteLabIdealSolution = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    DELETE FROM lab_ideal_solution
                    WHERE lab_id=?
                    `;
        db.run(sql, [labId], (err, row) => {
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

exports.getLabPlayersCount = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) FROM user_lab WHERE lab_id=?`;
        db.get(sql, [labId], (err, row) => {
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

exports.countAll = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) FROM lab`;
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

exports.countLabsWithoutParticipants = () => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT COUNT(DISTINCT id) 
                    FROM lab
                    WHERE id NOT IN (
                        SELECT lab_id
                        FROM user_lab
                    )
                    `;
        db.get(sql, [], (err, row) => {
            if (err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            }
            else {
                resolve(row["COUNT(DISTINCT id)"]);
            }
        });
    });
}

exports.stopLabIfExpired = (date) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    UPDATE lab
                    SET active = 0
                    WHERE active = 1 AND expiration_date = ?
                    `;
        db.run(sql, [date], (err, row) => {
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

exports.getSolutionRepositoryLink = (labId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT solution_repository FROM lab_ideal_solution WHERE lab_id = ?'
        db.get(sql, [labId], (err, row) => {
            if(err) {
                console.log(err)
                reject(new Exception(500, 'Database error'));
            } else {
                resolve(row.solution_repository)
            }
        })
    })
}