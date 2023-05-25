const util = require('util')
const exec = util.promisify(require('child_process').exec);
const e = require('child_process');
const path = require('path');
const utilPath = require('../utils/utilPath')

const { performance } = require('perf_hooks'); //for time logging

const parentFolder = utilPath.rootPackages //cartella in cui andranno clonati tutti i progetti

exports.getAbsolutePath = (folderName) => {
    return path.join(parentFolder, folderName);
}

exports.cloneIdealSolution = async (linkToRepo, directoryName) => {
    try {
        console.log('Cloning repo ' + linkToRepo + ' into ' + directoryName);
        const { stdout, stderr } = await exec(`git clone ${linkToRepo} ${directoryName}`);
        console.log(`stdout clone: ${stdout}`);
        console.log(`stderr clone: ${stderr}`);
    } catch(e) {
        console.log('Error cloning ideal solution')
        console.log('Is the link correct? ' + linkToRepo)
        throw(e)
    }
    
}

exports.cloneIdealSolutionPrivate = async (linkToRepo, directoryName, gitUsername, accessToken) => {
    const protocol = 'https://'
    const linkNoHttps = linkToRepo.slice(protocol.length)
    console.log(`git clone https://${gitUsername}:${accessToken}@${linkNoHttps}.git ${directoryName}`)
    await exec(`git clone https://${gitUsername}:${accessToken}@${linkNoHttps}.git ${directoryName}`)
}

exports.cloneRepoInDirectory = async (linkToRepo, directoryName) => {
    const correctPath = path.join(parentFolder, directoryName)
    console.log('Cloning repo ' + linkToRepo + ' into ' + correctPath);
    const { stdout, stderr } = await exec(`git clone ${linkToRepo} ${correctPath}`);
    /*
    console.log(`stdout clone: ${stdout}`);
    console.log(`stderr clone: ${stderr}`);
    */
}

exports.clonePrivateRepoInDir = async (linkToRepo, directoryName, gitUsername, accessToken) => {
    const protocol = 'https://'
    const linkNoHttps = linkToRepo.slice(protocol.length)
    console.log(`git clone https://${gitUsername}:${accessToken}@${linkNoHttps}.git ${directoryName}`)
    await exec(`git clone https://${gitUsername}:${accessToken}@${linkNoHttps}.git ${directoryName}`)
}

exports.getTestPath = (project_path) => {
    const projectCorrectPath = path.normalize(project_path);
    return path.join(projectCorrectPath, path.normalize('src/test/java/it/polito/po/test'));
}


exports.mavenCompile = (projectDir) => {
    const startTime = performance.now()
    //const correctProjectDirPath = utilPath.toAbsolutePath(path.normalize(projectDir));
    try {
        e.execSync(`cd ${projectDir} && mvn clean compile`)
        //e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn clean compile`);

    } catch (e) {
        const endTime = performance.now()
        const total = endTime - startTime
        console.log('Time: ' + total)
        console.log()
        throw e;
    }
    const endTime = performance.now()
    const total = endTime - startTime
    console.log('Time: ' + total)
    console.log()
}

exports.mavenTestCompile = (projectDir) => {
    const startTime = performance.now()
    const correctProjectDirPath = utilPath.toAbsolutePath(path.normalize(projectDir));
    try {
        //e.execSync(`cd ${projectDir} && mvn clean test-compile`)
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn clean test-compile`);

    } catch (e) {
        const endTime = performance.now()
        const total = endTime - startTime
        console.log('Time: ' + total)
        console.log()
        throw e;
    }
    const endTime = performance.now()
    const total = endTime - startTime
    console.log('Time: ' + total)
    console.log()
}

exports.mavenTest = (projectDir) => {
    const startTime = performance.now()
    const correctProjectDirPath = utilPath.toAbsolutePath(path.normalize(projectDir));
    try {
        e.execSync(`docker run --rm --name my-maven-project -v "${correctProjectDirPath}":/usr/src/mymaven -w /usr/src/mymaven maven:3.8.6-openjdk-18 mvn -e -X clean test`);
    } catch (e) {
        const endTime = performance.now()
        const total = endTime - startTime
        console.log('Time: ' + total)
        console.log()
        throw e;
    }
    const endTime = performance.now()
    const total = endTime - startTime
    console.log('Time: ' + total)
    console.log()
}


exports.ls = async (projectDir) => {
    const correctPath = path.normalize(projectDir);
    const { stdout, stderr } = await exec(`dir ${correctPath}`);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
}