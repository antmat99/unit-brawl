import Result from './models/Result'
import Achievement from './models/Achievement'
import Avatar from './models/Avatar';
import Lab from './models/Lab';

async function getUserResults() {
    return [
        new Result('Lab 1', true, 1523, 13),
        new Result('Lab 2', false, 1321, 2)
    ];
}

async function getUserAvatars() {
    return [
        new Avatar(1, "Avatar 1", "Description for Avatar 1", "/images/neil_watts_placeholder.png", 1),
        new Avatar(2, "Avatar 2", "Description for Avatar 2", "/images/neil_watts_placeholder.png", 1),
        new Avatar(1, "Avatar 3", "Description for Avatar 3", "/images/neil_watts_placeholder.png", 1)
    ]
}

async function getUserName() {
    return 'Antonio'
}

async function getUserSurname() {
    return 'Materazzo'
}

async function getUserNickname() {
    return 'antmat99'
}

async function getUserAchievements() {
    return [
        new Achievement('Coverage Student', 'Reach 50% coverage on a project', true, '/images/neil_watts_placeholder.png', 100),
        new Achievement('Coverage Expert', 'Reach 70% coverage on a project', true, '/images/neil_watts_placeholder.png', 100),
        new Achievement('Coverage Master', 'Reach 90% coverage on a project', false, '/images/neil_watts_placeholder.png', 70)
    ]
}

async function getUserMoney() {
    return 12;
}

async function getUserUnlockedAchievementsCount() {
    return 12;
}

//ritorna gli avatar non in possesso dell'utente
async function getAvailableAvatars() {
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

async function buyAvatars(avatarList) {

}

async function getLabs() {
    const leaderboard = [
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
    const personalResult = new Result('Lab 1', false, 1321, 10) 
    return [
        new Lab("Lab 1", "04-10-2022", "traccia lab 1", true, leaderboard,personalResult,"player"),
        new Lab("Lab 2", "11-10-2022", "traccia lab 2", true, leaderboard,personalResult,"player"),
        new Lab("Lab 3", "26-11-2022", "traccia lab 3", false, leaderboard,personalResult,"player")
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
        getUserResults,
        getUserAvatars,
        getUserName,
        getUserSurname,
        getUserNickname,
        getUserAchievements,
        getUserMoney,
        getUserUnlockedAchievementsCount,
        getAvailableAvatars,
        buyAvatars,
        getLabs,
        getGlobalLeaderboard
    };
    export default API;