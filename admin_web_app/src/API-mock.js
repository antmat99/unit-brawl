import Result from './models/Result'
import Achievement from './models/Achievement'
import Avatar from './models/Avatar';
import Lab from './models/Lab';


async function getLabs() {
    const leaderboard = [
        new Result('Lab 1', true, 1523, 1, 'mario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 2, 'luigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 3, 'wario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 4, 'peach', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 5, 'waluigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 6, 'toad', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 7, 'bowser', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 8, 'DK', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 9, 'koopa', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 10, 'daisy', '/images/neil_watts_placeholder.png')
    ]
    return [
        new Lab(0, "Lab 1", "04-10-2022", "traccia lab 1", true, leaderboard, 12, 'link 1'),
        new Lab(1, "Lab 2", "11-10-2022", "traccia lab 2", true, leaderboard, 3,'link 2'),
        new Lab(2, "Lab 3", "18-11-2022", "traccia lab 3", false, leaderboard, 6,'link 3')
    ];
}

async function createAndStartLab(lab) {
    console.log('start lab')
}

async function getActiveLab() {

    //set to undefined if there isn't any active lab (res code is 404)

    const leaderboard = [
        new Result('Lab 1', true, 1523, 1, 'mario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 2, 'luigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 3, 'wario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 4, 'peach', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 5, 'waluigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 6, 'toad', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 7, 'bowser', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 8, 'DK', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 9, 'koopa', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 10, 'daisy', '/images/neil_watts_placeholder.png')
    ]
    return new Lab(2, "Lab 3", "18-11-2022", "traccia lab 3", false, leaderboard, 6, 'link 2');
}


async function updateLab(lab) {
    //TODO
    //throw error message if res code is 500
}

async function deleteLab(lab) {
    //TODO
    //throw error message if res code is 500
}

async function stopLab(lab) {
    //TODO
    //throw error message if res code is 500
}

async function getLab(labId) {
    const leaderboard = [
        new Result('Lab 1', true, 1523, 1, 'mario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 2, 'luigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 3, 'wario', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 4, 'peach', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 5, 'waluigi', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 6, 'toad', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 7, 'bowser', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 8, 'DK', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 9, 'koopa', '/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 10, 'daisy', '/images/neil_watts_placeholder.png')
    ]
    return new Lab(2, "Lab 3", "18-11-2022", "traccia lab 3", false, leaderboard, 6,'link 2');
}

async function getAvatarList() {
    return [
        new Avatar(1, "Avatar 1 Available", "Description for Avatar 1 Available", "/images/neil_watts_placeholder.png", 1),
        new Avatar(2, "Avatar 2 Available", "Description for Avatar 2 Available", "/images/neil_watts_placeholder.png", 34),
        new Avatar(3, "Avatar 3 Available", "Description for Avatar 3 Available", "/images/neil_watts_placeholder.png", 14),
        new Avatar(4, "Avatar 4 Available", "Description for Avatar 4 Available", "/images/neil_watts_placeholder.png", 155),
        new Avatar(5, "Avatar 5 Available", "Description for Avatar 5 Available", "/images/neil_watts_placeholder.png", 2),
        new Avatar(6, "Avatar 6 Available", "Description for Avatar 6 Available", "/images/neil_watts_placeholder.png", 1),
        new Avatar(7, "Avatar 7 Available", "Description for Avatar 7 Available", "/images/neil_watts_placeholder.png", 67),
        new Avatar(8, "Avatar 8 Available", "Description for Avatar 8 Available", "/images/neil_watts_placeholder.png", 1),
        new Avatar(9, "Avatar 9 Available", "Description for Avatar 9 Available", "/images/neil_watts_placeholder.png", 1),
        new Avatar(10, "Avatar 10 Available", "Description for Avatar 10 Available", "/images/neil_watts_placeholder.png", 565)
    ]
}

async function deleteAvatar(avatar) {
    console.log('avatar deleted')
}

async function updateAvatar(avatar) {
    console.log('avatar updated')
}

async function createAvatar(avatar) {
    console.log('avatar created')
}

async function getNumberOfPlayers(labId) {
    return 16;
}

async function getGeneralReport() {
    return [['a', 'b', 'c', 'd', 'e']];
}

async function getLabsReport() {
    return [
        ['a', 'b', 'c', 'd'],
        ['a2', 'b2', 'c2', 'd2']
    ];

}

async function getUsersReport() {
    return [
        ['a', 'b', 'c', 'd', 'e', 'f'],
        ['a2', 'b2', 'c2', 'd2', 'e2', 'f2']
    ];
}

async function getGlobalLeaderboard(){
    return [
        new Result('Lab 1', true, 1523, 1, 'mario','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 2, 'luigi','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 3, 'wario','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 4, 'peach','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 5, 'waluigi','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 6, 'toad','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 7, 'bowser','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 8, 'DK','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 9, 'koopa','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 10, 'daisy','/images/neil_watts_placeholder.png')
    ]
}

const API = {
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
    getGlobalLeaderboard
};
export default API;