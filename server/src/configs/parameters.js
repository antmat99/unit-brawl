const defaultAvatarId = 0;
const initialMoney = 100;
const initialPoints = 1;

/**
 * Leaderboard points are assigned in intervals of 5 points (INTERVAL), starting from 2000 (WINNER_POINTS) and decreasing 
 * (for example, 2000 to the first one, 1995 to the second one, 1990 to the third one, etc .)
 * By doing so we cover 2000/5 = 400 positions and even the last one classified will receive not-too-low points.
 * Formula to know how many points to give is WINNER_POINTS - INTERVAL * (position - 1)
 */
//const WINNER_POINTS = 2000;
const WINNER_POINTS = 4000;
const INTERVAL = 5;

/* Achievements' parameters */

const JOIN_1 = 'JOIN_1'
const JOIN_3 = 'JOIN_3'
const JOIN_5 = 'JOIN_5'

const TOP_100_1 = 'TOP_100_1'
const TOP_100_3 = 'TOP_100_3'
const TOP_100_5 = 'TOP_100_5'
const TOP_50_1 = 'TOP_50_1'
const TOP_50_3 = 'TOP_50_3'
const TOP_50_5 = 'TOP_50_5'
const TOP_20_1 = 'TOP_20_1'
const TOP_20_3 = 'TOP_20_3'
const TOP_20_5 = 'TOP_20_5'

const COVERAGE_50_1 = "COVERAGE_50_1"
const COVERAGE_70_1 = "COVERAGE_70_1"
const COVERAGE_85_1 = "COVERAGE_85_1"

const AVATARS_4 = 'AVATARS_4'
const AVATARS_10 = 'AVATARS_10'
const AVATARS_20 = 'AVATARS_20'

const POINTS_PER_FAILURE = 1;
const POINTS_PER_PASSED = 1;
const MONEY_PER_POINT = 1;


module.exports = {
    defaultAvatarId,
    initialMoney,
    initialPoints,
    WINNER_POINTS,
    INTERVAL,
    JOIN_1,
    JOIN_3,
    JOIN_5,
    TOP_100_1,
    TOP_100_3,
    TOP_100_5,
    TOP_50_1,
    TOP_50_3,
    TOP_50_5,
    TOP_20_1,
    TOP_20_3,
    TOP_20_5,
    COVERAGE_50_1,
    COVERAGE_70_1,
    COVERAGE_85_1,
    AVATARS_4,
    AVATARS_10,
    AVATARS_20,
    POINTS_PER_FAILURE,
    MONEY_PER_POINT,
    POINTS_PER_PASSED
}