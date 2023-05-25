const labDao = require('../daos/lab-dao');
const userDao = require('../daos/user-dao');
const userLabDao = require('../daos/user-lab-dao');
const achievementDao = require('../daos/achievement-dao');
const pathUtil = require('../utils/utilPath')
const LabAdmin = require('../models/LabAdmin')
const Lab = require('../models/Lab')
const Exception = require('../models/Exception')
const Result = require('../models/Result')
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

const path = require('path')
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

exports.createLab = async (lab, username, accessToken) => {
    try {
        console.log('Cleaning ideal solution directory...')
        fileService.clearDirectory('test/ideal_solution')
        console.log('Cloning ideal solution...')
        await shellService.cloneIdealSolutionPrivate(lab.linkToIdealSolution, 'test/ideal_solution', username, accessToken)
        console.log('Successfully cloned ideal solution')
        const id = await labDao.createLab(lab)
        await labDao.insertLabIdealSolution(id, lab.linkToIdealSolution, username, accessToken);
        await achievementDao.clearAchievementFake();
        console.log(`Created DB entry for new lab with username ${username} and access token ${accessToken}`)
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

/*
exports.updateLab = async (lab) => {
    try {
        //TODO it should be atomic
        if (isValidGitRepo(lab.linkToIdealSolution)) {
            await labDao.updateLab(lab);
            fileService.clearDirectory('test/ideal_solution')
            await shellService.cloneIdealSolution(lab.linkToIdealSolution, 'test/ideal_solution')
            await labDao.updateLabLinkToIdealSolution(lab);
            let ret = await labDao.getLabByIdAdmin(lab.id);
            const leaderboard = await getLabLeaderboardAdmin(lab.id)
            ret['leaderboard'] = leaderboard;
            return ret;
        } else {
            throw new Exception(500, `Invalid git repository link: ${lab.linkToIdealSolution}`)
        }
    } catch (e) {
        throw new Exception(500, e.message)
    }
}*/

exports.updateLab = async (lab, username, accessToken) => {
    try {
        console.log('Cleaning ideal solution directory...')
        fileService.clearDirectory('test/ideal_solution')
        console.log('Cloning ideal solution...')
        await shellService.cloneIdealSolutionPrivate(lab.linkToIdealSolution, 'test/ideal_solution', username, accessToken)
        console.log('Successfully cloned ideal solution')
        await labDao.updateLab(lab);
        await labDao.updateLabLinkToIdealSolution(lab, username, accessToken);
        let ret = await labDao.getLabByIdAdmin(lab.id);
        const leaderboard = await getLabLeaderboardAdmin(lab.id)
        ret['leaderboard'] = leaderboard;
        return ret;
    } catch (e) {
        console.log(e)
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
            labId = await labDao.getActiveLab()
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
        testsReport: {}
    }

    const studentId = await userDao.getNicknameById(sid)
    //const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\packages\\check\\${studentId}`

    try {
        const activeLab = await labDao.getActiveLab()
        const userLab = await userLabDao.getUserLabByUserIdLabId(sid, activeLab[0].id)
        const gitlabUsername = await labDao.getLabSubmitterId(activeLab[0].id)
        const accessToken = await labDao.getLabAccessToken(activeLab[0].id)
        const studentRepositoryLink = userLab.repository

        if (fs.existsSync(`test/packages/check/${studentId}`) && fs.readdirSync(`test/packages/check/${studentId}`).length !== 0) {
            fileService.clearDirectory(`test/packages/check/${studentId}`)
        }

        await shellService.clonePrivateRepoInDir(studentRepositoryLink, `test/packages/check/${studentId}`, gitlabUsername, accessToken)
        console.log('Successfully cloned student\'s solution')
        updateIdeal()
        fileService.copyFolderSync(`${pathUtil.rootIdealsolution}/test/it`, `${pathUtil.rootPackages}/check/${studentId}/test/it`)
        console.log('Running ideal tests...')
        try {
            e.execSync(`cd test/packages/check/${studentId} && mvn -Dtest="**/it/**/*.java" clean test`)

            //e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/it/**/*.java" clean test`);

            console.log('Ideal tests passed')
            const rawTestsReport = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/TEST-it.polito.po.test.AllTests.xml`)
            result.testsReport = this.analyzeTestReport(rawTestsReport)
            cleanup(studentId)
            return result
        } catch (e) {
            if (fs.readdirSync(`test/packages/check/${studentId}/target/classes`).length !== 0 && fs.readdirSync(`test/packages/check/${studentId}/target/test-classes`).length !== 0) {
                /* Compilation succeeded, tests failed */
                console.log('Ideal tests failed')
                const rawTestsReport = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/TEST-it.polito.po.test.AllTests.xml`)
                result.testsReport = this.analyzeTestReport(rawTestsReport)
                cleanup(studentId)
                return result
            } else {
                /* Compilation failed */
                result.compiles = false
                console.log('Student\'s solution does not compile')
                cleanup(studentId)
                return result
            }
        }
    } catch (e) {
        console.log('ERROR: ' + e)
        result.error = true
        return result
        //cleanup(studentId)
    }
}

exports.test = async (sid) => {
    try {
        const user = await userDao.getUserById(sid)
        const studentId = user.nickname
        const accessToken = user.gitlabAccessToken
        const studentLink = 'https://gitlab.com/s292488/diet-student2'
        console.log(`Student ID: ${studentId} - Access token: ${accessToken} - Link to repo: ${studentLink}`)
        await shellService.clonePrivateRepoInDir(studentLink, `test/packages/tmp/${studentId}`, studentId, accessToken)
    } catch (e) {
        console.log('Error cloning private repo: ' + e)
    }
}

exports.checkCoverage = async (sid) => {
    var result = {
        compiles: true,
        coverageReport: {},
        totalTests: undefined,
        maxTestNumber: undefined,
        studentTestsPass: true
    }

    const studentId = await userDao.getNicknameById(sid)
    const activeLab = await labDao.getActiveLab()
    const userLab = await userLabDao.getUserLabByUserIdLabId(sid, activeLab[0].id)
    const gitlabUsername = await labDao.getLabSubmitterId(activeLab[0].id)
    const accessToken = await labDao.getLabAccessToken(activeLab[0].id)
    const studentRepositoryLink = userLab.repository
    //const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\packages\\check\\${studentId}`

    try {
        result.maxTestNumber = await labDao.getActiveLabMaxTestNumber()
        //fileService.clearDirectory(`test/packages/check/${studentId}`)
        //await shellService.clonePrivateRepoInDir(studentLink, `/check/${studentId}`, studentId, password)
        await shellService.clonePrivateRepoInDir(studentRepositoryLink, `test/packages/check/${studentId}`, gitlabUsername, accessToken)
        updateIdeal() // TODO: handle privacy of ideal solution
        console.log('Running student\'s tests...')
        try {
            e.execSync(`cd test/packages/check/${studentId} && mvn -Dtest="**/${studentId}/**/*.java" clean test`);
            //e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/${studentId}/**/*.java" clean test`);
            console.log('Student\'s tests passed')
            result.studentTestNumberByRequirement = countTestByRequirement(studentId)
            const rawCoverageReport = fs.readFileSync(`${pathUtil.rootPackages}/check/${studentId}/target/site/jacoco/jacoco.xml`)
            result.coverageReport = this.analyzeCoverageReport(rawCoverageReport)
            const percentage = (Number(result.coverageReport.instructionsCovered) / (Number(result.coverageReport.instructionsCovered) + Number(result.coverageReport.instructionsMissed))) * 100
            if (result.totalTests <= result.maxTestNumber) {
                await updatePercentage(sid, percentage)
            }
            cleanup(studentId)
            return result
        } catch (e) {
            if (fs.readdirSync(`test/packages/check/${studentId}/target/classes`).length === 0 || fs.readdirSync(`test/packages/check/${studentId}/target/test-classes`).length === 0) {
                result.compiles = false
                console.log('Student\'s solution does not compile')
                cleanup(studentId)
                return result
            } else {
                result.studentTestsPass = false
                console.log('Student\'s tests failed, did not generate coverage report')
                cleanup(studentId)
                return result
            }
        }
    } catch (e) {
        console.log('ERROR: ' + e)
        result.error = true
        return result
        //cleanup(studentId)
    }
}

exports.checkCompile = async (studentId) => {
    try {
        shellService.mavenCompile(`test/packages/check/${studentId}`)
        return true
    } catch (e) {
        console.log('Error during compile: ' + e)
        return false
    }
}

exports.checkTestCompile = async (studentId) => {
    try {
        shellService.mavenTestCompile(`test/packages/check/${studentId}`)
        return true
    } catch (e) {
        console.log('Error during test compile: ' + e)
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
            } else if (key === 'failure') {
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

function countTestByRequirement(studentId) {

    var result = {}

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseNodeValue: true
    };
    const parser = new xml.XMLParser(options);

    const xmlFiles = fs.readdirSync(`test/packages/check/${studentId}/target/surefire-reports`).filter(file => path.extname(file) === '.xml')
    xmlFiles.forEach(file => {
        const rep = fs.readFileSync(`test/packages/check/${studentId}/target/surefire-reports/${file}`)
        const report = parser.parse(rep)
        const testsuite = report['testsuite']
        const testcases = testsuite['testcase']
        if (testcases.length > 1) {
            testcases.forEach(tc => {
                const req = `R${Number.parseInt(tc.name[5])}`
                if (!result.hasOwnProperty(req)) {
                    result[req] = 1
                } else {
                    result[req]++
                }
            })
        } else {
            const req = `R${Number.parseInt(testcases.name[5])}`
            if (!result.hasOwnProperty(req)) {
                result[req] = 1
            } else {
                result[req]++
            }
        }
    })

    let totalTests = 0;

    for (const req in result) {
        if (result.hasOwnProperty(req)) {
            totalTests += result[req];
        }
    }
    console.log(JSON.stringify(totalTests))
    return totalTests;
}

async function updatePercentage(userId, percentage) {
    const activeLab = await labDao.getActiveLab()
    try {
        console.log(`Setting coverage ${percentage}% for student ${userId} in lab ${activeLab[0].id}`)
        return await userLabDao.updateUserLabCoverage(userId, activeLab[0].id, percentage)
    } catch (e) {
        console.log(e)
        throw new Exception(500, e.message)
    }
}

/* Utility */
function cleanup(studentId) {
    fileService.clearDirectory(`test/packages/check/${studentId}`)
    fileService.deleteDirectory(`test/packages/check/${studentId}`)
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
