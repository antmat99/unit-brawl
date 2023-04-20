const labDao = require('../daos/lab-dao');
const userDao = require('../daos/user-dao');
const userLabDao = require('../daos/user-lab-dao');
const achievementDao = require('../daos/achievement-dao');
const LabAdmin = require('../models/LabAdmin')
const Lab = require('../models/Lab')
const Exception = require('../models/Exception')
const Result = require('../models/Result')
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

const fs = require('fs')
const e = require('child_process');

const shellService = require('./shellService')
const fileService = require('./fileService');
const xml = require('fast-xml-parser')
dayjs.extend(customParseFormat)

exports.getAllLabs = async (userId) => {
    try {
        const labs = await labDao.getAllLabs();
        const res = await Promise.all(labs.map(async lab => {
            const result = await userDao.getUserLabByUserIdLabId(userId, lab.id);
            const fullLeaderboard = await labDao.getLabLeaderboard(lab.id);
            const leaderboard = fullLeaderboard.slice(0, 10);
            return new Lab(
                lab.id,
                lab.name,
                lab.expiration_date,
                lab.trace,
                !lab.active,
                leaderboard,
                (result != undefined) ?
                    {
                        labName: result.labName,
                        completed: true,
                        points: result.points,
                        position: result.position,
                        username: undefined,
                        userAvatarLink: undefined
                    }
                    :
                    undefined,
                (result != undefined) ? result.nickname : ''
            )
        }))
        return res;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getAllLabsWithIdealSolution = async () => {
    try {
        const labs = await labDao.getAllLabsWithIdealSolution()
        const res = await Promise.all(labs.map(async lab => {
            const leaderboard = await getLabLeaderboardAdmin(lab.id);
            return new LabAdmin(
                lab.id,
                lab.name,
                lab.expiration_date,
                lab.trace,
                !lab.active,
                leaderboard,
                lab.test_max_number,
                lab.solution_repository
            )
        }))
        console.log(res)
        return res;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getLabLeaderboardAdmin = async (labId) => {
    try {
        return await getLabLeaderboardAdmin(labId)
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getLabLeaderboard = async (labId, positions) => {
    try {
        return await labDao.getLabLeaderboard(labId, positions);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

const getLabLeaderboardAdmin = async (labId) => {
    try {
        return await labDao.getLabLeaderboardAdmin(labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.createLab = async (lab) => {
    try {
        //TODO it should be atomic
        const id = await labDao.createLab(lab);
        await labDao.insertLabIdealSolution(id, lab.linkToIdealSolution);
        await achievementDao.clearAchievementFake();
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.getActiveLab = async () => {
    try {
        const ret = await labDao.getActiveLab();
        if (ret.length == 0) throw (new Exception(404, 'No active labs found.'));
        if (ret.length > 1) throw (new Exception(500, 'Database error: there should be at most one active lab, but found ' + ret.length + '.'));
        return ret[0];
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.updateLab = async (lab) => {
    try {
        //TODO it should be atomic
        await labDao.updateLab(lab);
        await labDao.updateLabLinkToIdealSolution(lab);
        let ret = await labDao.getLabByIdAdmin(lab.id);
        const leaderboard = await getLabLeaderboardAdmin(lab.id)
        ret['leaderboard'] = leaderboard;
        return ret;
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.deleteLab = async (labId) => {
    try {
        //TODO it should be atomic
        await labDao.deleteLabIdealSolution(labId);
        await labDao.deleteLab(labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.stopLab = async (labId) => {
    try {
        if (await labDao.getLabByIdAdmin(labId) == undefined) throw new Exception(404, 'No lab found for id ' + labId)
        return await labDao.setActive(labId, false);
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.getLabByIdAdmin = async (labId) => {
    try {
        const ret = await labDao.getLabByIdAdmin(labId);
        if (ret == undefined) throw new Exception(404, 'No lab found for id ' + labId);
        const leaderboard = await getLabLeaderboardAdmin(labId);
        return new LabAdmin(
            ret.id,
            ret.name,
            ret.expiration_date,
            ret.trace,
            !ret.active,
            leaderboard,
            ret.test_max_number,
            ret.solution_repository
        );
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.getLabPlayersCount = async (labId) => {
    try {
        if (await labDao.getLabByIdAdmin(labId) == undefined) throw new Exception(404, 'No lab found for id ' + labId)
        const ret = await labDao.getLabPlayersCount(labId);
        return ret;
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.joinLab = async (userId, repositoryLink) => {
    try {
        const activeLab = await labDao.getActiveLab();
        if (activeLab.length == 0) throw (new Exception(404, 'No active labs found.'));
        if (activeLab.length > 1) throw (new Exception(500, 'Database error: there should be at most one active lab, but found ' + ret.length + '.'));
        const ret = await userLabDao.insertUserLab(userId, activeLab[0].id, repositoryLink);
        //initialize coverage achievements
        const uncompletedCoverageAchievements = await achievementDao.getUncompletedCoverageAchievements(userId);
        for (let achievement of uncompletedCoverageAchievements) {
            await achievementDao.addUserAchievementFake(userId, achievement.achievement_id, 0, achievement.code);
        }
        return ret;
    } catch (e) {
        if (e.code != 500) throw new Exception(e.code, e.message)
        throw new Exception(500, e.message)
    }
}

exports.stopLabIfExpired = () => {
    try {
        labDao.stopLabIfExpired(dayjs().format('DD-MM-YYYY'));
    } catch (e) {
        //handle error
    }
}

/* --------------------------------------------------------------- */

exports.checkProgress = async () => {
    // TODO: use actual repo links
    var result = {
        compiles: true,
        report: {}
    }

    try {
        // 1. Clone student repo
        // 2. Student solution compiles?
        //  YES -> continue, NO -> return value to communicate it
        // 3. Clone solution repo
        // 4. Copy solutions tests, requirement per requirement
        // 5. Check which pass
        // 6. Return value to communicate it

        console.log('Cloning user\'s repository...')
        await shellService.cloneRepoInDirectory('https://gitlab.com/matteofavretto/mountain-huts.git', '/check/student')
        console.log('Successfully cloned student\'s repository')
        const compilationCheck = await this.checkCompile()
        if (compilationCheck) {
            console.log('Cloning solution\'s repository...')
            await shellService.cloneRepoInDirectory('https://gitlab.com/matteofavretto/mountain-huts-solution.git', '/check/ideal')
            console.log('Successfully cloned solution\'s repository')
            try {
                const report = this.runTests()
                result.report = this.analyzeReport(report)
                cleanup()
                return result
            } catch (e) {
                console.log('Error running tests: ' + e)
                cleanup()
            }
            cleanup()
            return result
        } else {
            console.log('Student\'s solution does not compiles')
            fileService.clearDirectory('test/packages/check/student')
            fileService.deleteDirectory('test/packages/check/student')
            result.compiles = false
            return result
        }
    } catch (e) {
        console.error('Error checking progress: ' + e)
        cleanup()
    }
}

function cleanup() {
    fileService.clearDirectory('test/packages/check')
    fileService.deleteDirectory('test/packages/check')
}

exports.test = async () => {
    const testReport = fs.readFileSync('test/packages/check/student/lab/target/surefire-reports/TEST-AllTests.xml')
    const parsed = this.analyzeReport(testReport)
    return parsed
} 

exports.runTests = () => {
    // We now have test/packages/check/student/lab and test/packages/check/ideal/lab
    // We need to copy .../ideal/lab/src/test
    // TODO use actual repo
    const correctProjectDirPath = "C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\packages\\check\\student\\lab"
    console.log('Copying ideal tests in student\'s repo...')
    fileService.copyDirectoryFiles('test/packages/check/ideal/lab/src/test/java', 'test/packages/check/student/lab/src/test/java')
    console.log('Running tests...')
    try {
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X clean test -Dtest="AllTests.java"`);
        console.log('Getting tests results...')
        const testReport = fs.readFileSync('test/packages/check/student/lab/target/surefire-reports/TEST-AllTests.xml')
/*         const options = { ignoreAttributes: false };
        const parser = new xml.XMLParser(options);
        const reportJSON = parser.parse(testReport) */
        return testReport
    } catch (e) {
        console.log('Getting tests results...')
        const testReport = fs.readFileSync('test/packages/check/student/lab/target/surefire-reports/TEST-AllTests.xml')
 /*        const options = { ignoreAttributes: false };
        const parser = new xml.XMLParser(options);
        const reportJSON = parser.parse(testReport) */
        return testReport
    }   
}

exports.checkCompile = async () => {
    try {
        console.log('Checking if student\'s solution compiles...')
        shellService.mavenCompile('test/packages/check/student/lab')
        console.log('Student\'s solution compiles')
        return true
    } catch (e) {
        console.error('Student\'s solution does not compile: ' + e)
        return false
    }
}

exports.analyzeReport = (rep) => {

    const options = { 
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseNodeValue: true 
    };
    const parser = new xml.XMLParser(options);
    const report = parser.parse(rep)
    
    const testsuite = report['testsuite']

    const totalTests = testsuite['tests']
    const failures = testsuite['failures']
    const errors = testsuite['errors']
    const skipped = testsuite['skipped']

    const testcases = testsuite['testcase']

    const testcasesObj = testcases.map(tc => {
        const tcObj = {}
        Object.keys(tc).forEach(key => {
            if(key !== 'failure') {
                tcObj[key] = tc[key]
            } else {
                tcObj['failureMessage'] = tc[key]['message']
                tcObj['failureType'] = tc[key]['type']
            }
        })

        return tcObj
    })

    const groupedByClassname = testcasesObj.reduce((acc, tc) => {
        const key = tc.classname;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(tc);
        return acc;
      }, {});

    const result = {
        'totalTests': totalTests,
        'failures': failures,
        'errors': errors,
        'skipped': skipped,
        'testCases': groupedByClassname
    }
    return result
}

exports.getTestsReport = async (repositoryLink) => {
    // TODO: check user solution against ideal solution and show which tests (requirements) pass and which don't
    try {
        console.log('Getting user\'s progress in lab...')
        console.log('Clonining user\'s repository')
        await shellService.cloneRepoInDirectory(repositoryLink, '/tmp')
        console.log('Cloned user\'s repository')
        /*         console.log('Checking if solution compiles')
                shellService.mavenCompile('test/packages/tmp/lab')
                console.log('Your solution compiles!') */
        console.log('Running your tests...')
        shellService.mavenTest('test/packages/tmp/lab')
        console.log('Getting tests results...')
        const reportString = fs.readFileSync('test/packages/tmp/lab/target/surefire-reports/TEST-testClass.xml')
        const options = { ignoreAttributes: false };
        const parser = new xml.XMLParser(options);
        const reportJSON = parser.parse(reportString)
        console.log('Report retrieved!')
        console.log('Removing directory')
        fileService.clearDirectory('test/packages/tmp')
        fileService.deleteDirectory('test/packages/tmp')
        return reportJSON
    } catch (e) {
        // TODO: handle build failure
        console.error('Error getting lab progress: ' + e)
    }
} 
