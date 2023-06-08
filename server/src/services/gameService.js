const labDao = require('../daos/lab-dao');
const userDao = require('../daos/user-dao');
const userLabDao = require('../daos/user-lab-dao');
const achievementDao = require('../daos/achievement-dao');
const shellService = require('./shellService');
const fileService = require('./fileService');
const labService = require('./labService');
const utilPath = require('../utils/utilPath');
const utilFunction = require('../utils/utilFunctions')
const parameters = require('../configs/parameters')
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat)

const e = require('child_process');
const xml = require('fast-xml-parser')
const fs = require('fs')
const path = require('path');
const schedule = require('node-schedule');

const Solution = require('../models/Solution');

const rootIdealsolution = utilPath.rootIdealsolution;
const rootPackages = utilPath.rootPackages;
const rootWarzone = utilPath.rootWarzone;

const { performance } = require('perf_hooks'); //for performance logging
const { count } = require('console');

exports.testFinalProcess = async (labId) => {
    //await labDao.setActive(2, 1)
    finalProcess(labId);

}

/* Task run each midnight to eventually start final_process */
const labStopper = schedule.scheduleJob('0 0 * * *', async () => {
    if (await shouldStartFinalProcess()) {
        finalProcess()
    }
    //labService.stopLabIfExpired()
});

const shouldStartFinalProcess = async () => {
    const activeLab = await labDao.getActiveLab()
    if (activeLab.length == 0) return false;
    else return activeLab[0].expiration_date == dayjs().format('DD-MM-YYYY')
}

exports.finalProcess = async (labId) => {

    /*     const participants =
            [
                {
                    user_id: 1,
                    lab_id: 57,
                    points: 0,
                    position: 0,
                    repository: 'https://gitlab.com/s292488/diet-student2',
                    coverage_percentage: 72.168284789644,
                    tests_failed_on_enemy: 0,
                    tests_enemy_passed: 0,
                    studentId: 's236507',
                    idealTestsPass: true,
                    eliminated: false
                },
                {
                    user_id: 2,
                    lab_id: 57,
                    points: 0,
                    position: 0,
                    repository: 'https://gitlab.com/s292488/diet-student1',
                    coverage_percentage: 90.69579288025889,
                    tests_failed_on_enemy: 0,
                    tests_enemy_passed: 0,
                    studentId: 's292488',
                    idealTestsPass: true,
                    eliminated: false
                },
                {
                    user_id: 3,
                    lab_id: 57,
                    points: 0,
                    position: 0,
                    repository: 'https://gitlab.com/s292488/diet-student3',
                    coverage_percentage: 89.72491909385113,
                    tests_failed_on_enemy: 0,
                    tests_enemy_passed: 0,
                    studentId: 's123456',
                    idealTestsPass: true,
                    eliminated: false
                },
                {
                    user_id: 4,
                    lab_id: 57,
                    points: 0,
                    position: 0,
                    repository: 'https://gitlab.com/s292488/diet-ideal-tests-fail',
                    coverage_percentage: 36.650485436893206,
                    tests_failed_on_enemy: 0,
                    tests_enemy_passed: 0,
                    studentId: 's000000',
                    idealTestsPass: false,
                    eliminated: false
                }
            ]

    const results = {
        s236507: { enemyTestsPassed: 10, testsFailedOnEnemy: 4, idealTestsPass: true },
        s292488: { enemyTestsPassed: 6, testsFailedOnEnemy: 0, idealTestsPass: false },
        s000000: { enemyTestsPassed: 16, testsFailedOnEnemy: 0, idealTestsPass: false}
    }
    */
    

    try {
        const username = await labDao.getLabSubmitterId(labId)
        const accessToken = await labDao.getLabAccessToken(labId)
        const idealLink = await labDao.getLinkToIdealSolution(labId)
        const cap = await labDao.getTestCap(labId)
        console.log(`Starting war for lab ${labId}`)
        const participants = await labDao.getUserLabListByLabId(labId)
        console.log('Participants for this lab are...')
        console.log(participants)
        console.log(`Cloning ideal solution from ${idealLink}`)
        fileService.clearDirectory('test/ideal_solution')
        await shellService.cloneIdealSolutionPrivate(idealLink, 'test/ideal_solution', username, accessToken)
        console.log('Successfully cloned ideal solution')
        console.log('Filtering solutions...')
        var survivors = await filter(participants, username, accessToken, cap)
        console.log('Survivors: ')
        console.log(survivors)
        assembleFiringSquad()
        console.log('Firing squad assembled')
        console.log('Starting the battle...')
        const results = await battle(survivors)
        console.log('RESULTS')
        console.log(results)
        await updateWarResults(labId, results)
        await userLabDao.updateLabPosition(labId)
        return await userLabDao.getLeaderboard(labId)
    } catch (e) {
        console.log('ERROR during final process')
        cleanup()
        console.log(e)
    }
}

function cleanup() {
    fileService.clearDirectory(`test/warzone/firingSquad`)
    fileService.clearDirectory(`test/warzone/participants`)
}

const filter = async (participants, username, accessToken, cap) => {

    const survivors = await Promise.all(
        participants.map(async (p) => {
            const studentId = await userDao.getNicknameById(p.user_id);
            p.studentId = studentId
            await shellService.clonePrivateRepoInDir(
                p.repository,
                `test/warzone/participants/${studentId}`,
                username,
                accessToken
            );
            const checkResult = await checkStudent(studentId, cap);
            p.idealTestsPass = checkResult.idealTestsPass;
            p.eliminated = checkResult.eliminated;
            if (p.eliminated === false) {
                return p;
            } else {
                fileService.clearDirectory(`test/warzone/participants/${studentId}`)
                fileService.deleteDirectory(`test/warzone/participants/${studentId}`)
            }
        })
    );

    return survivors.filter(Boolean);
}

const checkStudent = async (studentId, cap) => {
    var result = {
        idealTestsPass: true,
        eliminated: false
    }
    console.log(`Checking ${studentId}`)
    const numberOfStudentTests = runStudentTestsOnStudent(studentId) // If compile failed or tests failed, this is false
    if (numberOfStudentTests !== false) {
        if (numberOfStudentTests <= cap) {
            const idealTestsOnStudentResult = runIdealTestsOnStudent(studentId)
            if (idealTestsOnStudentResult.compiles) {
                if (idealTestsOnStudentResult.passed === false) {
                    result.idealTestsPass = false // Malus
                }
                const studentTestsPassOnIdeal = runStudentTestsOnIdeal(studentId)
                if (studentTestsPassOnIdeal === false) {
                    console.log(`${studentId} eliminated - Student\'s tests fail on ideal solution`)
                    result.eliminated = true // because student's tests fail on ideal solution
                }
            } else {
                console.log(`${studentId} eliminated - Compilation failed with ideal tests`)
                result.eliminated = true // because compilation failed with ideal tests
            }
        } else {
            console.log(`${studentId} eliminated - Exceeded test cap: ${numberOfStudentTests} / ${cap}`)
            result.eliminated = true // because exceeded test number cap
        }
    } else {
        console.log(`${studentId} eliminated - Student\'s tests either don\'t compile or fail`)
        result.eliminated = true // because either compilation failed with student's tests or student's tests fail
    }

    return result
}

const runStudentTestsOnStudent = (studentId) => {
    const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\warzone\\participants\\${studentId}`
    try {
        console.log(`Running student\'s tests on student solution...`)
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -Dtest="**/${studentId}/**/*.java" clean test`);
    } catch (e) {
        /* Whether the compilation failed or the tests failed is irrelevant, all it matters is that something went wrong */
        console.log(`Student's tests compilation failed or tests failed for student ${studentId}`)
        return false
    }

    console.log(`Student\'s tests passed on own solution for user ${studentId}`)
    const testNumber = countStudentTests(studentId)
    console.log(`Student ${studentId} has submitted ${testNumber} tests`)
    return testNumber
}

const countStudentTests = (studentId) => {

    var result = {}

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseNodeValue: true
    };
    const parser = new xml.XMLParser(options);

    const xmlFiles = fs.readdirSync(`test/warzone/participants/${studentId}/target/surefire-reports`).filter(file => path.extname(file) === '.xml')
    xmlFiles.forEach(file => {
        const rep = fs.readFileSync(`test/warzone/participants/${studentId}/target/surefire-reports/${file}`)
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

const runIdealTestsOnStudent = (studentId) => {
    var result = {
        compiles: true,
        passed: true
    }
    const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\warzone\\participants\\${studentId}`
    try {
        fileService.copyFolderSync(`test/ideal_solution/test/it`, `test/warzone/participants/${studentId}/test/it`)
        console.log(`Running ideal tests on student solution...`)
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/it/**/*.java" clean test`);
    } catch (e) {
        if (fs.readdirSync(`test/warzone/participants/${studentId}/target/classes`).length !== 0 && fs.readdirSync(`test/warzone/participants/${studentId}/target/test-classes`).length !== 0) {
            /* Compilation succeeded, tests failed */
            console.log(`Ideal tests failed on student solution for ${studentId}`)
            result.passed = false
        } else {
            console.log(`Compilation with ideal tests failed for student ${studentId}`)
            result.compiles = false
        }
    } finally {
        if (result.passed === true && result.compiles === true) console.log(`Ideal tests passed on student solution for ${studentId}`)
        fileService.clearDirectory(`test/warzone/participants/${studentId}/test/it`)
        fileService.deleteDirectory(`test/warzone/participants/${studentId}/test/it`)
        return result
    }
}

const runStudentTestsOnIdeal = (studentId) => {
    const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\ideal_solution`
    try {
        fileService.copyFolderSync(`test/warzone/participants/${studentId}/test/${studentId}`, `test/ideal_solution/test/${studentId}`)
        console.log(`Running student\'s tests on ideal solution...`)
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/${studentId}/**/*.java" clean test`);
        console.log(`Student\'s tests passed on ideal solution for student ${studentId}`)
        fileService.clearDirectory(`test/ideal_solution/test/${studentId}`)
        fileService.deleteDirectory(`test/ideal_solution/test/${studentId}`)
        return true
    } catch (e) {
        console.log(`Student\'s tests failed on ideal for student ${studentId}`)
        return false
    }
}

const assembleFiringSquad = () => {

    const srcFolder = 'test/warzone/participants/'
    const dstFolder = 'test/warzone/firingSquad/'
    if (!fs.existsSync(dstFolder)) {
        fs.mkdirSync(dstFolder);
    }

    // Read the contents of the source folder
    fs.readdirSync(srcFolder).forEach((folderName) => {
        const sourceTestFolder = path.join(srcFolder, folderName, 'test', folderName);
        const targetTestFolder = path.join(dstFolder, folderName);

        console.log(`Copying ${sourceTestFolder} in ${targetTestFolder}`)

        // Check if the source test folder exists
        if (fs.existsSync(sourceTestFolder)) {
            // Create the target test folder if it doesn't exist
            if (!fs.existsSync(targetTestFolder)) {
                fs.mkdirSync(targetTestFolder);
            }

            // Copy the contents of the source test folder to the target test folder
            fs.readdirSync(sourceTestFolder).forEach((file) => {
                const sourceFilePath = path.join(sourceTestFolder, file);
                const targetFilePath = path.join(targetTestFolder, file);
                fs.copyFileSync(sourceFilePath, targetFilePath);
            });
        }
    })
}

const battle = async (participants) => {
    var results = {}
    try {
        await copyTestBatteryInStudents()
        console.log('Copied test battery in students')
        participants.forEach(async (p) => {
            console.log(`Running test battery on ${p.studentId}...`)
            await runTestBatteryOnStudent(p.studentId)
            results = await processResult(results, p.studentId, p.idealTestsPass)
        })
        return results
    } catch (e) {
        console.log('Error during battle: ' + e)
    }

}

const copyTestBatteryInStudents = async () => {

    const participantsDir = 'test/warzone/participants';
    const firingSquadDir = 'test/warzone/firingSquad';

    try {
        fs.readdirSync(firingSquadDir).forEach((firingSquadTestsFolder) => {
            fs.readdirSync(participantsDir).forEach((participantsFolder) => {
                if (firingSquadTestsFolder !== participantsFolder) {
                    const dstPath = path.join(participantsDir, participantsFolder, 'test', firingSquadTestsFolder)
                    if (!fs.existsSync(dstPath)) {
                        fs.mkdirSync(dstPath)
                        fs.readdirSync(path.join(firingSquadDir, firingSquadTestsFolder)).forEach((fileInFiringSquadTestFolder) => {
                            const src = path.join(firingSquadDir, firingSquadTestsFolder, fileInFiringSquadTestFolder)
                            const dest = path.join(participantsDir, participantsFolder, 'test', firingSquadTestsFolder, fileInFiringSquadTestFolder)
                            fs.copyFileSync(src, dest)
                        })
                    }
                }
            })
        })

        fs.readdirSync(participantsDir).forEach((participantsFolder) => {
            fs.rmSync(path.join(participantsDir, participantsFolder, 'test', participantsFolder), { recursive: true })
        })
    } catch (e) {
        console.log('ERROR while copying test battery in student: ' + e)
    }

}

const runTestBatteryOnStudent = async (studentId) => {
    const correctProjectDirPath = `C:\\Users\\matty\\Poli\\Tesi\\unitBrawl\\unit-brawl\\server\\test\\warzone\\participants\\${studentId}`
    try {
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X -Dtest="**/s*/**/*.java" clean test`);
        // e.execSync(`cd test/warzone/participants/${studentId} && mvn clean test -Dtest="**/s*/**/*.java`)
        console.log(`${studentId} has passed every test!`)
    } catch (e) {
        console.log(`There are tests failures for ${studentId}`)
        const stdout = Buffer.from(e.stdout, 'utf-8')
        const stderr = Buffer.from(e.stderr, 'utf-8')
        console.log('STDOUT: ')
        console.log(stdout)
        console.log('STDERR: ')
        console.log(stderr)
    }
}

const processResult = async (results, studentId, idealTestsPass) => {

    const testReportPath = `test/warzone/participants/${studentId}/target/surefire-reports`
    try {
        const testReportFiles = fs.readdirSync(testReportPath)

        testReportFiles.forEach((file) => {
            if (file.endsWith('.txt')) {
                const author = file.split('.')[0]
                const report = fs.readFileSync(path.join(testReportPath, file), 'utf-8')
                const totalMatches = report.match(/Tests run: (\d+)/);
                const failuresMatches = report.match(/Failures: (\d+)/);
                const errorsMatches = report.match(/Errors: (\d+)/);
                const skippedMatches = report.match(/Skipped: (\d+)/);

                const total = totalMatches ? parseInt(totalMatches[1], 10) : 0;
                const failures = failuresMatches ? parseInt(failuresMatches[1], 10) : 0;
                const errors = errorsMatches ? parseInt(errorsMatches[1], 10) : 0;
                const skipped = skippedMatches ? parseInt(skippedMatches[1], 10) : 0;
                const passed = total - failures - errors - skipped

                if (!results[studentId]) {
                    results[studentId] = {
                        enemyTestsPassed: 0,
                        testsFailedOnEnemy: 0,
                        idealTestsPass: idealTestsPass
                    }
                }

                results[studentId].enemyTestsPassed += passed

                if (failures > 0) {
                    results[author].testsFailedOnEnemy += failures
                }
            }
        })

        return results
    } catch (e) {
        console.log('ERROR parsing tests results: ' + e)
    }
}

/*
const updateWarResults = async (labId, results) => {
    console.log('Updating results')
    Object.keys(results).forEach(async (studentId) => {
        console.log(`Updating results for ${studentId}`)
        const userId = await userDao.getIdByNickname(studentId)
        const enemyTestsPassed = results[studentId].enemyTestsPassed
        const testsFailedOnEnemy = results[studentId].testsFailedOnEnemy
        const malusIdealTests = results[studentId].idealTestsPass ? 1 : 0.7
        const points = (parameters.POINTS_PER_PASSED * enemyTestsPassed + parameters.POINTS_PER_FAILURE * testsFailedOnEnemy) * malusIdealTests
        await userLabDao.updateLabResults(userId, labId, enemyTestsPassed, testsFailedOnEnemy, points)
        await userDao.addPoints(userId, points)
    })
}
*/

const updateWarResults = async (labId, results) => {
    console.log('Updating results')
    const updatePromises = Object.keys(results).map(async (studentId) => {
        console.log(`Updating results for ${studentId}`)
        const userId = await userDao.getIdByNickname(studentId)
        const enemyTestsPassed = results[studentId].enemyTestsPassed
        const testsFailedOnEnemy = results[studentId].testsFailedOnEnemy
        const malusIdealTests = results[studentId].idealTestsPass ? 1 : 0.7
        const points = (parameters.POINTS_PER_PASSED * enemyTestsPassed + parameters.POINTS_PER_FAILURE * testsFailedOnEnemy) * malusIdealTests
        await userLabDao.updateLabResults(userId, labId, enemyTestsPassed, testsFailedOnEnemy, points)
        await userDao.addPoints(userId, points)
    });

    await Promise.all(updatePromises)
}

/*
const final_process = async () => {
    console.log('Starting final process...')
    try {
        const start = performance.now()
        //take the active lab (from lab database)
        const lab = await getCurrentLab();
        const labId = lab.id;
        console.log('Got current lab: ')
        console.log(lab)
        console.log()
        //close active lab
        await close_lab(lab);
        //take all the user_labs related to the active lab (from database user_lab)
        const user_labs = await labDao.getUserLabListByLabId(labId);
        console.log('Got all user_labs: ')
        console.log(user_labs)
        console.log()
        //clone ideal solution 
        const linkToIdealSolution = await labDao.getLinkToIdealSolution(labId);
        console.log('Got ideal solution: ')
        console.log(linkToIdealSolution)
        console.log()
        fileService.clearDirectory(rootIdealsolution)
        await shellService.cloneIdealSolution(linkToIdealSolution, rootIdealsolution);
        //clono user repositories and obtain solutions (user_id, lab_id-path to packages/username folder)
        const solutions = await getSolutionsFromUserLabList(user_labs);
        console.log('Created solutions list: ')
        console.log(solutions)
        console.log()
        //filter solution (formality tests)
        const filtered_solutions = await filterSolutions(solutions);
        console.log('Filtered solutions. Remaining are: ')
        console.log(filtered_solutions)
        console.log()
        //start testing process and assign points
        await begin_war(filtered_solutions);
        //assign positions and update global leaderboard
        await assignPositionsAndUpdateGlobalLeaderboard(labId)
        //update achievements
        await updateAchievements(labId)
        console.log('end')
        const end = performance.now()
        const total = end - start;
        console.log('Total time: ' + total)
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }
 
 
}
 
*/

//returns filtered solutions
const filterSolutions = async (solutions) => {
    const ret = [];
    for (let solution of solutions) {
        const ok = await verifyAndMark(solution);
        if (ok) ret.push(solution)
    }
    return ret;
}

//ritorna active lab
const getCurrentLab = async () => {
    try {
        const all_labs = await labDao.getAllLabs()
        return all_labs.find(lab => lab.active)
    } catch (e) {
        //handle error
    }
}

//returns a Solution list by cloning user repos
const getSolutionsFromUserLabList = async (user_lab_list) => {
    const start = performance.now()
    const ret = []
    try {
        //clear folder where repos will be cloned
        fileService.clearDirectory(rootPackages);
        for (user_lab of user_lab_list) {
            //clone repo in a folder named by user's nickname
            const nickname = await userDao.getNicknameById(user_lab.user_id);
            await shellService.cloneRepoInDirectory(user_lab.repository, nickname);
            //create Solution object containing path to that folder
            const solution = new Solution(user_lab.user_id, user_lab.lab_id, utilPath.join(utilPath.rootPackages, nickname));
            //add Solution object to the array to return
            ret.push(solution);
        }
    } catch (e) {
        console.log(e)
    }
    const end = performance.now();
    const total = end - start;
    console.log('Total clone time: ' + total);
    return ret;

}

//if solution is valid assigns 1 point and return true, else assign 0 points and return false
const verifyAndMark = async (solution) => {
    const isValid = await isSolutionValid(solution);
    if (!isValid) {
        //assign 0 points to user_lab
        await userLabDao.assignPoints(0, solution.user_id, solution.lab_id);
        return false;
    }
    //assign initial points to user_lab
    await userLabDao.assignPoints(parameters.initialPoints, solution.user_id, solution.lab_id);
    return true;

}


const isSolutionValid = async (solution) => {
    //a solution is valid if its code compiles
    //and if its tests compile and don't fail on ideal solution
    try {
        return codeCheck(solution) && await testCheck(solution);
    } catch (e) {
        console.log(e);
        return false;
    }
}

//check if solution compiles
const codeCheck = (solution) => {
    console.log('Code check for solution:')
    console.log(solution)
    console.log()
    try {
        console.log('COMPILING: ' + path.join(solution.rootPackagesUsername))
        shellService.mavenCompile(path.join(solution.rootPackagesUsername))
        console.log('Solution compiles:')
        console.log(solution)
        console.log()
        return true
    } catch (e) {
        console.log('Solution does not compile:')
        console.log(solution)
        console.log()
        return false;
    }
}

const testCheck = async (solution) => {
    console.log('Test check for solution:')
    console.log(solution)
    console.log()
    try {
        //check if tests compile and don't fail on ideal solution
        //these tests are carried on in ideal_solution folder

        //deleting test/java of ideal solution and paste test/java from user's solution
        const userSolutionTestAbsPath = shellService.getTestPath(path.join(solution.rootPackagesUsername/*, utilPath.projectname*/)); //user's test/java
        const idealSolutionTestAbsPath = shellService.getTestPath(utilPath.rootIdealsolutionProjectname); //ideal solution's test/java
        console.log('Student solution: ' + userSolutionTestAbsPath)
        console.log('Ideal solution: ' + idealSolutionTestAbsPath)
        fileService.clearDirectory(idealSolutionTestAbsPath);
        fileService.copyDirectoryFiles(userSolutionTestAbsPath, idealSolutionTestAbsPath);

        //we have ideal src/main/java and user's src/test/java in rootIdealsolution

        shellService.mavenTest(utilPath.rootIdealsolutionProjectname); //exception if fail

        console.log('Tests for solution have passed compile and ideal solution check:')
        console.log(solution)
        console.log()
        //parse obtained file to check number of tests
        console.log('Test max number check for solution:')
        console.log(solution)
        console.log()
        const ret = await verifyTestReport(solution.lab_id, path.join(utilPath.rootIdealsolutionProjectname, path.normalize('/target/surefire-reports')));
        return ret
    } catch (e) {
        console.log(e)
        console.log('Tests for solution does not compile or does not pass ideal solution:')
        console.log(solution)
        console.log()
        return false;
        //throw e;
    }
}

//returns false if the number of tests exceeds the max allowed for this lab
const verifyTestReport = async (labId, testReportDirectory) => {
    const max = await labDao.getTestMaxNumber(labId);
    let tests = 0;
    let ret = true;
    fileService.getXmlFilesInDirectory(testReportDirectory).every(file => {
        const fileFullPath = path.join(testReportDirectory, file);
        //if there are failed tests, return false
        tests += fileService.getNumberOfTests(fileFullPath);
        //if tests > max return false
        if (tests > max) {
            console.log('Tests exceed test max number.')
            console.log()
            ret = false;
            return false;
        }
    })
    return ret;
}

const hasCompiled = (projectDirectory) => {
    const correctPath = path.normalize(projectDirectory);
    return fileService.existDirectory(path.join(correctPath, path.normalize('target/surefire-reports')));
}

const begin_war = async (solutions) => {
    //for each solution ( == for each player )
    for (let solution of solutions) {
        console.log()
        console.log('Begin war on solution ')
        console.log(solution)
        console.log()
        //update coverage
        console.log('Testing solution on itself')
        console.log(solution)
        console.log()
        const rootPackagesUsername = path.normalize(solution.rootPackagesUsername);
        const rootPackagesUsernameProjectname = path.join(rootPackagesUsername, utilPath.projectname);
        try {
            shellService.mavenTest(rootPackagesUsernameProjectname);
            await updateCoverage(solution)
        } catch (e) {
            console.log("Test failed on own solution")
            console.log()
        }

        //war is carried on in warzone folder

        //put user's tests in warzone/src/test/java 
        const rootPackagesUsernameProjectnameSrcTestJava = shellService.getTestPath(rootPackagesUsernameProjectname);
        const rootWarzoneSrcTestJava = shellService.getTestPath(rootWarzone);
        fileService.clearDirectory(rootWarzoneSrcTestJava);
        fileService.copyDirectoryContent(rootPackagesUsernameProjectnameSrcTestJava, rootWarzoneSrcTestJava);

        let points = 0; //points concerning user's tests failed on enemy solutions

        //for each enemy solution put its main into warzone's main and launch tests
        for (let solution_enemy of solutions) {
            if (solution.user_id != solution_enemy.user_id) {
                console.log('Testing against solution:')
                console.log(solution_enemy)
                console.log()
                points += await testVS(solution_enemy, solution);
            }
        }
        console.log('Solution total points: ' + points);
        console.log(solution)
        console.log()
        await userLabDao.addPoints(points, solution.user_id, solution.lab_id);
    }
}


const updateCoverage = async (solution) => {
    //calculate coverage as average (%) of classes' coverages
    const projectPath = path.join(solution.rootPackagesUsername, utilPath.projectname)
    const coverage = fileService.getLineCoveragePercentage(path.join(projectPath, path.normalize('target/site/jacoco/jacoco.xml')))
    console.log('Got ' + coverage + '% coverage for solution ')
    console.log(solution)
    console.log()
    await userLabDao.updateUserLabCoverage(solution.user_id, solution.lab_id, coverage);
}

const testVS = async (solution_enemy, solution) => {
    //put src/main/java of solution_enemy in warzone/src/main/java
    const rootPackagesEnemynameProject = path.join(path.normalize(solution_enemy.rootPackagesUsername), utilPath.projectname);
    const rootPackagesEnemynameProjectSrcMainJava = path.join(rootPackagesEnemynameProject, path.normalize('src/main/java'));
    const rootWarzoneSrcMainJava = path.join(rootWarzone, path.normalize('src/main/java'));
    fileService.clearDirectory(rootWarzoneSrcMainJava);
    fileService.copyDirectoryContent(rootPackagesEnemynameProjectSrcMainJava, rootWarzoneSrcMainJava);
    //mvn test in warzone
    try {
        shellService.mavenTest(rootWarzone);
    } catch (e) { }//non-blocking because we have to analyze reports
    //analyze reports in warzone/target/surefire-report: +1 in points for each failed test
    let failed = 0;
    let passed = 0;
    const test_reports_directory = path.join(rootWarzone, path.normalize('target/surefire-reports'))
    fileService.getXmlFilesInDirectory(test_reports_directory).forEach(file => {
        const fileFullPath = path.join(test_reports_directory, file);
        failed += Number(fileService.getNumberOfFailures(fileFullPath));
        passed += Number(fileService.getNumberOfPassed(fileFullPath));
    })
    //update passed and failed in db
    await userLabDao.updateUserLabFailedOnEnemy(solution.user_id, solution.lab_id, failed);
    await userLabDao.updateUserLabPassedOnMine(solution_enemy.user_id, solution_enemy.lab_id, passed);
    //assign points to enemy solution per each passed test
    const enemy_points = passed * parameters.POINTS_PER_PASSED;
    await userLabDao.addPoints(enemy_points, solution_enemy.user_id, solution_enemy.lab_id);
    console.log('Totalized ' + failed + ' against solution ')
    console.log(solution_enemy)
    console.log('Assigned  ' + enemy_points + ' to above solution ')
    console.log()
    return failed * parameters.POINTS_PER_FAILURE;
}


const close_lab = async (lab) => {
    await labDao.setActive(lab.id, 0);
}

const assignPositionsAndUpdateGlobalLeaderboard = async (labId) => {
    console.log('Updating leaderboard')
    const userLabs = await userLabDao.getUserLabAndGeneratePositionByLabId(labId); //user_id, lab_id, position to insert into db
    for (let userLab of userLabs) {
        //assign money
        const labPoints = userLabDao.getPoints(userLab.user_id, userLab.lab_id)
        const money = labPoints * parameters.MONEY_PER_POINT;
        await userDao.addMoney(userLab.user_id, money)
        //insert position into db
        console.log('Updating position for userlab')
        console.log(userLab)
        await userLabDao.updateUserLabPosition(userLab.user_id, userLab.lab_id, userLab.position)
        const userId = userLab.user_id
        const position = userLab.position
        //update global points
        const finalPoints = parameters.WINNER_POINTS - parameters.INTERVAL * (position - 1);
        console.log('Assigned ' + finalPoints + ' to user ' + userId)
        await userDao.addPoints(userId, finalPoints);
    }

}


/******************************************** Achievements ***********************************************************/


const updateAchievements = async () => {
    const users = await userDao.getAllUsers()
    for (let user of users) {
        await updateJoinAchievements(user.id)
        await updateTopAchievements(user.id)
        await updateCoverageAchievements(user.id)
        await updateAvatarsAchievements(user.id)
    }
}

const updateJoinAchievements = async (userId) => {
    console.log('Updating join achievements')
    const labsJoinedNumber = await userLabDao.countUserLabsAttended(userId);
    //JOIN_1
    if (! await isAchievementCompleted(parameters.JOIN_1, userId)) {
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.JOIN_1, utilFunction.max100(labsJoinedNumber * 100))
    }
    //JOIN_3
    if (! await isAchievementCompleted(parameters.JOIN_3, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.JOIN_3, utilFunction.max100((labsJoinedNumber / 3) * 100))
    //JOIN_5
    if (! await isAchievementCompleted(parameters.JOIN_5, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.JOIN_5, utilFunction.max100((labsJoinedNumber / 5) * 100))
}

const updateTopAchievements = async (userId) => {
    console.log('Updating top achievements')
    const countUserPositionsGreaterEqual100 = await userLabDao.countUserPositionsGreaterEqual(userId, 100)
    //TOP_100_1
    if (! await isAchievementCompleted(parameters.TOP_100_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_100_1, utilFunction.max100((countUserPositionsGreaterEqual100) * 100))
    //TOP_100_3
    if (! await isAchievementCompleted(parameters.TOP_100_3, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_100_3, utilFunction.max100((countUserPositionsGreaterEqual100 / 3) * 100))
    //TOP_100_5
    if (! await isAchievementCompleted(parameters.TOP_100_5, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_100_5, utilFunction.max100((countUserPositionsGreaterEqual100 / 5) * 100))

    const countUserPositionsGreaterEqual50 = await userLabDao.countUserPositionsGreaterEqual(userId, 50)
    //TOP_50_1
    if (! await isAchievementCompleted(parameters.TOP_50_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_50_1, utilFunction.max100((countUserPositionsGreaterEqual50) * 100))
    //TOP_50_3
    if (! await isAchievementCompleted(parameters.TOP_50_3, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_50_3, utilFunction.max100((countUserPositionsGreaterEqual50 / 3) * 100))
    //TOP_50_5
    if (! await isAchievementCompleted(parameters.TOP_50_5, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_50_5, utilFunction.max100((countUserPositionsGreaterEqual50 / 5) * 100))

    const countUserPositionsGreaterEqual20 = await userLabDao.countUserPositionsGreaterEqual(userId, 20)
    //TOP_20_1
    if (! await isAchievementCompleted(parameters.TOP_20_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_20_1, utilFunction.max100((countUserPositionsGreaterEqual20) * 100))
    //TOP_20_3
    if (! await isAchievementCompleted(parameters.TOP_20_3, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_20_3, utilFunction.max100((countUserPositionsGreaterEqual20 / 3) * 100))
    //TOP_20_5
    if (! await isAchievementCompleted(parameters.TOP_20_5, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.TOP_20_5, utilFunction.max100((countUserPositionsGreaterEqual20 / 5) * 100))
}

const updateCoverageAchievements = async (userId) => {
    console.log('Updating coverage achievements')
    const maxUserCoverage = await userLabDao.getUserBestCoverage(userId);
    //COVERAGE_50_1
    if (! await isAchievementCompleted(parameters.COVERAGE_50_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.COVERAGE_50_1, utilFunction.max100((maxUserCoverage * 100) / 50));
    //COVERAGE_70_1
    if (! await isAchievementCompleted(parameters.COVERAGE_70_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.COVERAGE_70_1, utilFunction.max100((maxUserCoverage * 100) / 70));
    //COVERAGE_85_1
    if (! await isAchievementCompleted(parameters.COVERAGE_85_1, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.COVERAGE_85_1, utilFunction.max100((maxUserCoverage * 100) / 85));
}

const updateAvatarsAchievements = async (userId) => {
    console.log('Updating avatars achievements')
    const userAvatarList = await userDao.getUserAvatarList(userId)
    const numberOfAvatars = userAvatarList.length
    //AVATAR_4
    if (! await isAchievementCompleted(parameters.AVATARS_4, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.AVATARS_4, utilFunction.max100((numberOfAvatars / 4) * 100))
    //AVATAR_10
    if (! await isAchievementCompleted(parameters.AVATARS_10, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.AVATARS_10, utilFunction.max100((numberOfAvatars / 10) * 100))
    //AVATAR_20
    if (! await isAchievementCompleted(parameters.AVATARS_20, userId))
        await achievementDao.updateAchievementCompletitionPercentage(userId, parameters.AVATARS_20, utilFunction.max100((numberOfAvatars / 20) * 100))
}

const isAchievementCompleted = async (achievementCode, userId) => {
    return await achievementDao.getAchievementPercentageByCode(userId, achievementCode) == 100;
}

exports.updateCoverageAchievementsFake = async (userId, coverage) => {
    //COVERAGE_50_1
    if (! await isAchievementCompleted(parameters.COVERAGE_50_1, userId)) {
        await achievementDao.updateAchievementFakeCompletitionPercentage(userId, parameters.COVERAGE_50_1, utilFunction.max100((coverage * 100) / 50));
    }
    //COVERAGE_70_1
    if (! await isAchievementCompleted(parameters.COVERAGE_70_1, userId))
        await achievementDao.updateAchievementFakeCompletitionPercentage(userId, parameters.COVERAGE_70_1, utilFunction.max100((coverage * 100) / 70));
    //COVERAGE_85_1
    if (!await isAchievementCompleted(parameters.COVERAGE_85_1, userId))
        await achievementDao.updateAchievementFakeCompletitionPercentage(userId, parameters.COVERAGE_85_1, utilFunction.max100((coverage * 100) / 85));
}

