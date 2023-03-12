import Result from './models/Result'
import Achievement from './models/Achievement'
import Avatar from './models/Avatar';
import Lab from './models/Lab';

const URL = 'http://localhost:3001';

/* Login APIs */

async function registerUser(credentials) {
    let response = await fetch(URL + '/users/register', {
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


async function register(user) {
    let response = await fetch(URL + '/sessions/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                user: {
                    nickname: user.nickname,
                    password: user.password,
                    name: user.name,
                    surname: user.surname,
                    email: user.email
                }
            }
        ),
    });
    if (response.ok) {
        return;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}


/* Other APIs */

async function getUserResults() {
    const response = await fetch(URL + '/users/results', { credentials: 'include' });
    const resultsJson = await response.json();
    if (response.ok) {
        const ret = resultsJson.map(result => {
            return new Result(
                result.labName,
                true,
                result.points,
                result.position,
                result.nickname,
                ''
            )
        });
        console.log(ret)
        return ret;
    } else {
        throw resultsJson;  // an object with the error coming from the server
    }
}

async function getUserAvatars() {
    const response = await fetch(URL + '/users/avatars', { credentials: 'include' });
    const avatarsJson = await response.json();
    if (response.ok) {
        const ret = avatarsJson.map(avatar => {
            return new Avatar(
                avatar.id,
                avatar.name,
                avatar.description,
                avatar.imagePath,
                avatar.price
            )
        });
        console.log(ret)
        return ret;
    } else {
        throw avatarsJson;  // an object with the error coming from the server
    }
}

async function getUserName() {
    const response = await fetch(URL + '/users/name', { credentials: 'include' });
    const name = response.json();
    if (response.ok) {
        return name;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getUserSurname() {
    const response = await fetch(URL + '/users/surname', { credentials: 'include' });
    const surname = response.json();
    if (response.ok) {
        return surname;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getUserNickname() {
    const response = await fetch(URL + '/users/nickname', { credentials: 'include' });
    const nickname = response.json();
    if (response.ok) {
        return nickname;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getUserAchievements() {
    const response = await fetch(URL + '/users/achievements', { credentials: 'include' });
    const achievementsJson = await response.json();
    if (response.ok) {
        console.log(achievementsJson)
        return achievementsJson;
    } else {
        throw achievementsJson;  // an object with the error coming from the server
    }
}

async function getUserAchievementsFake() {
    const response = await fetch(URL + '/users/achievements/fake', { credentials: 'include' });
    const achievementsJson = await response.json();
    if (response.ok) {
        console.log(achievementsJson)
        return achievementsJson;
    } else {
        throw achievementsJson;  // an object with the error coming from the server
    }
}

async function getUserMoney() {
    const response = await fetch(URL + '/users/money', { credentials: 'include' });
    const money = response.json();
    if (response.ok) {
        return money;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getUserUnlockedAchievementsCount() {
    const response = await fetch(URL + '/users/achievements/quantity', { credentials: 'include' });
    const count = await response.json();
    if (response.ok) {
        return count;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getAvailableAvatars() {
    const response = await fetch(URL + '/users/avatars/not', { credentials: 'include' });
    const avatarsJson = await response.json();
    if (response.ok) {
        const ret = avatarsJson.map(avatar => {
            return new Avatar(
                avatar.id,
                avatar.name,
                avatar.description,
                avatar.imagePath,
                avatar.price
            )
        });
        return ret;
    } else {
        throw avatarsJson;  // an object with the error coming from the server
    }
}

async function buyAvatars(avatarList) {
    const idList = avatarList.map(avatar => { return avatar.id })
    const response = await fetch(URL + '/avatars/shop',
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                avatarIdList: idList
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getLabs() {
    const response = await fetch(URL + '/labs', { credentials: 'include' });
    if (response.ok) {
        const labsJson = await response.json();
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
                lab.name,
                lab.deadline,
                lab.trace,
                lab.expired,
                leaderboard,
                lab.userResult,
                lab.username,
                lab.id,
                lab.testMaxNumber,

            )
        });
        return ret;
    } else {
        throw response.json();  // an object with the error coming from the server
    }
}

async function getGlobalLeaderboard() {
    const response = await fetch(URL + '/leaderboard/10', { credentials: 'include' });
    const leaderboard = await response.json();
    if (response.ok) {
        console.log(leaderboard)
        return leaderboard;
    } else {
        throw leaderboard;  // an object with the error coming from the server
    }
}


async function getUserLabsAttended() {
    const response = await fetch(URL + '/users/labs', { credentials: 'include' });
    const labsIdsJson = await response.json();
    if (response.ok) {
        const ret = labsIdsJson.map(lab => {
            return lab.lab_id
        });
        return ret;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}


async function joinLab(repositoryLink) {
    const response = await fetch(URL + '/labs/join',
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repositoryLink: repositoryLink
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}


async function getUserLabRegionLeaderboard(labId) {
    const response = await fetch(URL + '/users/labs/regionLeaderboard?labId=' + labId, { credentials: 'include' });
    const leaderboard = await response.json();
    if (response.ok) {
        return leaderboard;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}

async function editRepository(labId, link) {
    const response = await fetch(URL + '/users/labs/repositoryLink?labId=' + labId,
        {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                link: link
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getRepositoryLink(labId) {
    const response = await fetch(URL + '/users/labs/repositoryLink?labId=' + labId, { credentials: 'include' });
    const link = await response.json();
    if (response.ok) {
        return link;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}

async function setAvatarAsPropic(avatarId) {
    const response = await fetch(URL + '/users/avatars/selected',
        {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                avatarId: avatarId
            })
        }
    );
    if (!response.ok) {
        throw await response.json()
    }
}

async function getUserAvatarSelected() {
    const response = await fetch(URL + '/users/avatars/selected', { credentials: 'include' });
    const avatar = await response.json();
    if (response.ok) {
        return avatar;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}

async function isUserJoinedActiveLab() {
    const response = await fetch(URL + '/users/labs/active/joined', { credentials: 'include' });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}

async function getGlobalRegionLeaderboard() {
    const response = await fetch(URL + '/leaderboard/region', { credentials: 'include' });
    const res = await response.json();
    if (response.ok) {
        console.log(res)
        return res;
    } else {
        throw await response.json();  // an object with the error coming from the server
    }
}


const API = {
    registerUser,
    logIn,
    logOut,
    register,
    getUserInfo,
    getUserResults,
    getUserAvatars,
    getUserName,
    getUserSurname,
    getUserNickname,
    getUserAchievements,
    getUserAchievementsFake,
    getUserMoney,
    getUserUnlockedAchievementsCount,
    getAvailableAvatars,
    buyAvatars,
    getLabs,
    getGlobalLeaderboard,
    getUserLabsAttended,
    joinLab,
    getUserLabRegionLeaderboard,
    editRepository,
    getRepositoryLink,
    setAvatarAsPropic,
    getUserAvatarSelected,
    isUserJoinedActiveLab,
    getGlobalRegionLeaderboard
};
export default API;