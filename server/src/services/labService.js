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
        console.log('Lab: ' + JSON.stringify(lab))
        const id = await labDao.createLab(lab);
        console.log('Cleaning ideal solution directory...')
        fileService.clearDirectory('test/ideal_solution')
        console.log('Cloning ideal solution...')
        await shellService.cloneIdealSolution(lab.linkToIdealSolution, 'test/ideal_solution')
        console.log('Successfully cloned ideal solution')
        await labDao.insertLabIdealSolution(id, lab.linkToIdealSolution);
        await achievementDao.clearAchievementFake();
    } catch (e) {
        console.log('Error creating lab: ' + e)
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
        fileService.clearDirectory('test/ideal_solution')
        await shellService.cloneIdealSolution(lab.linkToIdealSolution, 'test/ideal_solution')
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
        fileService.clearDirectory('test/ideal_solution')
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

exports.getSolutionRepositoryLink = async (labId) => {
    if (labId === undefined) {
        try {
            labId = await labDao.getActiveLabId()
        } catch (e) {
            throw new Exception(500, e.message)
        }
    }
    try {
        return await labDao.getSolutionRepositoryLink(labId);
    } catch (e) {
        throw new Exception(500, e.message)
    }
}

exports.checkProgress = async (sid) => {
    var result = {
        compiles: true,
        testsReport: {},
        coverageReport: {},
        studentTestNumber: undefined,
        maxTestNumber: undefined,
        studentTestsPass: true
    }

    var rawReports = {
        testsReport: {},
        coverageReport: {}
    }

    const studentId = await userDao.getNicknameById(sid)

    const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\packages\\check\\${studentId}`

    try {
        var studentRepoLink = await userDao.getActiveLabStudentLink(sid)
        var solutionRepoLink = await labDao.getActiveLabSolutionLink()
        studentRepoLink = studentRepoLink + '.git'
        solutionRepoLink = solutionRepoLink + '.git'

        result.maxTestNumber = await labDao.getActiveLabMaxTestNumber()

        console.log(`Cloning student\'s solution in test/packages/check/${studentId}...`)
        await shellService.cloneRepoInDirectory(studentRepoLink, `/check/${studentId}`)
        console.log('Successfully cloned student\'s solution')
        console.log('Checking if it compiles...')
        result.compiles = await this.checkCompile(studentId)
        if (!result.compiles) {
            console.log('Student\'s solution does not compile')
            cleanup(studentId)
            return result
        }
        console.log('Student\'s solution compiles')
        updateIdeal()
        //await shellService.cloneIdealSolution(solutionRepoLink, 'test/ideal_solution')
        
        fileService.copyFolderSync('test/ideal_solution/test/it', `test/packages/check/${studentId}/test/it`)
        console.log('Running ideal tests...')
        try {
            e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/it/**/*.java" clean test`);
            console.log('Ideal tests passed')
        } catch (e) {
            console.log('Ideal tests failed')
        }
        rawReports.testsReport = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/TEST-it.polito.po.test.AllTests.xml`)
        console.log('Running student\'s tests...')
        try {
            e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/${studentId}/**/*.java" clean test`);
            console.log('Student\'s tests passed')
        } catch (e) {
            console.log('Student\'s tests failed')
            result.studentTestsPass = false
        }
        if (result.studentTestsPass) {
            // TODO: fix test number method
            //result.studentTestNumber = getTestNumber(studentId)
            rawReports.coverageReport = fs.readFileSync(`test/packages/check/${studentId}/target/site/jacoco/jacoco.xml`)
            result.coverageReport = this.analyzeCoverageReport(rawReports.coverageReport)
        } else {
            console.log('Student\'s tests fail, did not generate coverage report')
        }
        result.testsReport = this.analyzeTestReport(rawReports.testsReport)
        result.testNumberExceeded = (result.studentTestNumber > result.maxTestNumber)
        if (result.testNumberExceeded) {
            console.log('Student\'s solution has ' + result.studentTestNumber + ' tests, which exceeds the maximum number: ' + result.maxTestNumber)
        }
        cleanup(studentId)
        return result
    } catch (e) {
        console.log('ERROR: ' + e)
        cleanup(studentId)
    }
}

exports.test = async (studentId) => {
    var result = {
        compiles: true,
        testReport: {},
        coverageReport: {}
    }

    try {
        const testReport = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/TEST-it.polito.po.test.AllTests.xml`)
        const coverageReport = fs.readFileSync(`test/packages/check/${studentId}/target/site/jacoco/jacoco.xml`)
        result.testReport = this.analyzeTestReport(testReport)
        result.coverageReport = this.analyzeCoverageReport(coverageReport)
        return result
    } catch (e) {
        console.error('Error checking progress: ' + e)
    }
}

exports.checkCompile = async (studentId) => {
    try {
        shellService.mavenCompile(`test/packages/check/${studentId}`)
        return true
    } catch (e) {
        return false
    }
}

exports.analyzeTestReport = (rep) => {

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
            if (key !== 'failure' && key !== 'error') {
                tcObj[key] = tc[key]
            } else if(key === 'failure') {
                tcObj['failureMessage'] = tc[key]['message']
                tcObj['failureType'] = tc[key]['type']
            } else {
                tcObj['errorMessage'] = tc[key]['message']
                tcObj['errorType'] = tc[key]['type']
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

exports.analyzeCoverageReport = (rep) => {

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseNodeValue: true
    };
    const parser = new xml.XMLParser(options);
    const reportObj = parser.parse(rep)
    const report = reportObj.report

    const instructionCounter = report.counter.find(counter => counter.type === 'INSTRUCTION')
    const methodCounter = report.counter.find(counter => counter.type === 'METHOD')
    const classCounter = report.counter.find(counter => counter.type === 'CLASS')

    const result = {
        'instructionsCovered': instructionCounter.covered,
        'instructionsMissed': instructionCounter.missed,
        'methodsCovered': methodCounter.covered,
        'methodsMissed': methodCounter.missed,
        'classesCovered': classCounter.covered,
        'classesMissed': classCounter.missed
    }

    return result
}

function getTestNumber(studentId) {
    const reportOutput = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/TEST-it.polito.po.test.TestClass.xml`)
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseNodeValue: true
    };
    const parser = new xml.XMLParser(options);
    const report = parser.parse(reportOutput)

    const testsuite = report['testsuite']
    return testsuite.tests
}

/* Utility */
function cleanup(studentId) {
    fileService.clearDirectory(`test/packages/check/${studentId}`)
    fileService.deleteDirectory(`test/packages/check/${studentId}`)
    fileService.deleteDirectory(`test/packages/check`)
}

function updateIdeal() {
    const startDir = process.cwd();

    try {
        process.chdir('test/ideal_solution');

        const gitFetchOutput = e.execSync('git fetch', { encoding: 'utf-8' });
        const gitDiffOutput = e.execSync('git diff HEAD origin/HEAD', { encoding: 'utf-8' });
    
        if (gitDiffOutput) {
            e.execSync('git pull', { encoding: 'utf-8' });
            console.log('Ideal solution updated.');
        } else {
            console.log('Ideal solution is up-to-date.');
        }
    } catch (error) {
        console.error(`Error checking ideal for updates: ${error.message}`);
    } finally {
        process.chdir(startDir);
    }
}
