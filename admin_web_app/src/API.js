import Result from './models/Result'
import Avatar from './models/Avatar';
import Lab from './models/Lab';

const URL = 'http://localhost:3001/eipiai'
//const URL = '/eipiai'

/* Login APIs */

async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

/* Other APIs */

async function getLabs() {
    const response = await fetch(URL + '/admin/labs', {credentials: 'include'});
    const labsJson = await response.json();
    console.log(labsJson)
    if (response.ok) {
        const ret = labsJson.map(lab => {
            const leaderboard = lab.leaderboard.map(result => {
                return new Result(
                    result.labName,
                    result.completed,
                    result.points,
                    result.position,
                    result.username,
                    result.userAvatarLink
                )
            }
            )
            return new Lab(
                lab.id,
                lab.name,
                lab.deadline,
                lab.trace,
                lab.expired,
                leaderboard,
                lab.testMaxNumber,
                lab.linkToIdealSolution
            )
        });
        console.log(ret)
        return ret;
    } else {
        throw labsJson;  // an object with the error coming from the server
    }
}

async function createAndStartLab(lab, username, accessToken) {
    const response = await fetch(URL + '/admin/labs',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lab: lab,
                username: username,
                accessToken: accessToken
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getActiveLab() {
    //set to undefined if there isn't any active lab (res code is 404)
    const response = await fetch(URL + '/admin/labs/active', {credentials: 'include'});
    if(response.status === 404) return undefined;
    const labJson = await response.json();
    console.log(response.status)
    if (response.ok) {
        const ret = new Lab(
            labJson.id,
            labJson.name,
            labJson.deadline,
            labJson.trace,
            labJson.expired,
            labJson.leaderboard,
            labJson.testMaxNumber,
            labJson.linkToIdealSolution
        )
        return ret;
    } else {
        throw labJson;  // an object with the error coming from the server
    }
}


async function updateLab(lab, username, token) {
    //throw error message if res code is 500
    const response = await fetch(URL + '/admin/labs',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lab: lab,
                username: username,
                token: token
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function deleteLab(lab) {
    //throw error message if res code is 500
    const response = await fetch(URL + '/admin/labs/' + lab.id,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function stopLab(lab) {
    //throw error message if res code is 500
    const response = await fetch(URL + '/admin/labs/stop/' + lab.id,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getLab(labId) {
    const response = await fetch(URL + '/admin/labs/' + labId, {credentials: 'include'});
    const labJson = await response.json();
    if (response.ok) {
        const ret = new Lab(
            labJson.id,
            labJson.name,
            labJson.deadline,
            labJson.trace,
            labJson.expired,
            labJson.leaderboard,
            labJson.testMaxNumber,
            labJson.linkToIdealSolution
        )
        return ret;
    } else {
        throw labJson;  // an object with the error coming from the server
    }
}

async function getAvatarList() {
    const response = await fetch(URL + '/admin/avatars', {credentials: 'include'});
    const avatarListJson = await response.json();
    if (response.ok) {
        const ret = avatarListJson.map(avatar => {
            return new Avatar(
                avatar.id, avatar.name, avatar.description, avatar.image_path, avatar.price
            )
        })
        return ret;
    } else {
        throw avatarListJson;  // an object with the error coming from the server
    }
}

async function deleteAvatar(avatar) {
    const response = await fetch(URL + '/admin/avatars/' + avatar.id,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function updateAvatar(avatar) {
    const response = await fetch(URL + '/admin/avatars',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...avatar
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function createAvatar(avatar) {
    const response = await fetch(URL + '/admin/avatars/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...avatar
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getNumberOfPlayers(labId) {
    const response = await fetch(URL + '/admin/labs/' + labId + '/players/count', {credentials: 'include'});
    const ret = await response.json();
    if (response.ok) {
        return ret;
    } else {
        throw ret;  // an object with the error coming from the server
    }
}

async function getGeneralReport() {
    const response = await fetch(URL + '/admin/reports/general', {credentials: 'include'});
    const report = await response.json();
    if (response.ok) {
        console.log(report)
        return report;
    } else {
        throw report;  // an object with the error coming from the server
    }
}

async function getLabsReport() {
    const response = await fetch(URL + '/admin/reports/labs', {credentials: 'include'});
    const report = await response.json();
    if (response.ok) {
        return report;
    } else {
        throw report;  // an object with the error coming from the server
    }
}

async function getUsersReport() {
    const response = await fetch(URL + '/admin/reports/users', {credentials: 'include'});
    const report = await response.json();
    if (response.ok) {
        return report;
    } else {
        throw report;  // an object with the error coming from the server
    }
}

async function getUserLabsReport() {
    const response = await fetch(URL + '/admin/reports/userLabs', {credentials: 'include'});
    const report = await response.json();
    if (response.ok) {
        return report;
    } else {
        throw report;  // an object with the error coming from the server
    }
}

async function getGlobalLeaderboard() {
    const response = await fetch(URL + '/admin/leaderboard', {credentials: 'include'});
    const leaderboard = await response.json();
    if (response.ok) {
        return leaderboard;
    } else {
        throw leaderboard;  // an object with the error coming from the server
    }
}

const API = {
    logIn,
    logOut,
    getUserInfo,
    getLabs,
    createAndStartLab,
    getActiveLab,
    updateLab,
    deleteLab,
    getLab,
    stopLab,
    getAvatarList,
    deleteAvatar,
    updateAvatar,
    createAvatar,
    getNumberOfPlayers,
    getGeneralReport,
    getLabsReport,
    getUsersReport,
    getUserLabsReport,
    getGlobalLeaderboard
};
export default API;