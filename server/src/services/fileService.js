const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const xml = require('fast-xml-parser');

const xmlParserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "properties"
};

exports.copyFileToPath = (srcPath, destPath) => {
    const correctSrcPath = path.normalize(srcPath);
    const correctDestPath = path.normalize(destPath);
    // File destination.txt will be created or overwritten by default.
    fs.copyFileSync(correctSrcPath, correctDestPath);
}

exports.createDirectory = (directoryPath) => {
    const correctPath = path.normalize(directoryPath);
    fs.mkdirSync(correctPath);
}

exports.clearDirectory = (directoryPath) => {
    const correctPath = path.normalize(directoryPath);
    const elements = fs.readdirSync(correctPath);
    elements.forEach(element => {
        const elementPath = path.join(correctPath, element);
        if (fs.statSync(elementPath).isFile()) fs.unlinkSync(elementPath);
        else fs.rmdirSync(elementPath, { recursive: true, force: true });
    });
}

exports.deleteDirectory = (directoryPath) => {
    const correctPath = path.normalize(directoryPath);
    fs.rmdirSync(correctPath);
}

//copia only files
exports.copyDirectoryFiles = (srcPath, destPath) => {
    const correctSrcPath = path.normalize(srcPath);
    const correctDestPath = path.normalize(destPath);
    const files = fs.readdirSync(correctSrcPath);
    files.forEach(file => {
        const filePath = path.join(correctSrcPath, file);
        fs.copyFileSync(filePath, path.join(correctDestPath, file));
    });
}

exports.getXmlFilesInDirectory = (directoryPath) => {
    const correctDirectoryPath = path.normalize(directoryPath);
    return fs.readdirSync(correctDirectoryPath).filter(element => fs.statSync(path.join(correctDirectoryPath, element)).isFile() && path.extname(path.join(correctDirectoryPath, element)) == '.xml');
}

//copy files and subdirectories
exports.copyDirectoryContent = (srcPath, destPath) => {
    const correctSrcPath = path.normalize(srcPath);
    const correctDestPath = path.normalize(destPath);
    const elements = fs.readdirSync(correctSrcPath);
    elements.forEach(element => {
        const elementPath = path.join(correctSrcPath, element);
        if (fs.statSync(elementPath).isFile()) fs.copyFileSync(elementPath,path.join(correctDestPath,element));
        else{ //directory
            fsExtra.mkdirSync(path.join(correctDestPath,element)); 
            fsExtra.copySync(elementPath,path.join(correctDestPath,element));
        } 
    });
}

exports.existDirectory = (directoryPath) => {
    const correctSrcPath = path.normalize(directoryPath);
    return fs.existsSync(correctSrcPath);
}

exports.copyFolderSync = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
          exports.copyFolderSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
}

/**************************************** PARSING ********************************************/

exports.getNumberOfTests = (testReportPath) => {
    const correctPath = path.normalize(testReportPath);
    const data = fs.readFileSync(correctPath, 'utf-8') //throw catch by gameService
    const xmlParser = new xml.XMLParser(xmlParserOptions);
    const xmlObject = xmlParser.parse(data);
    return xmlObject.testsuite.properties.tests;
}

exports.getNumberOfFailures = (testReportPath) => {
    //failures + errors
    const correctPath = path.normalize(testReportPath);
    const data = fs.readFileSync(correctPath, 'utf-8') //throw catch by gameService
    const xmlParser = new xml.XMLParser(xmlParserOptions);
    const xmlObject = xmlParser.parse(data);
    return Number(xmlObject.testsuite.properties.failures) + Number(xmlObject.testsuite.properties.errors);
}

exports.getNumberOfPassed = (testReportPath) => {
    const correctPath = path.normalize(testReportPath);
    const data = fs.readFileSync(correctPath, 'utf-8') //throw catch by gameService
    const xmlParser = new xml.XMLParser(xmlParserOptions);
    const xmlObject = xmlParser.parse(data);
    const failures = Number(xmlObject.testsuite.properties.failures) + Number(xmlObject.testsuite.properties.errors);
    const tests = Number(xmlObject.testsuite.properties.tests);
    const ret = tests - failures;
    return ret;
}

exports.getLineCoveragePercentage = (/*fileName,*/jacocoReportPath) => {
    
    const correctReportPath = path.normalize(jacocoReportPath);
    const data = fs.readFileSync(correctReportPath, 'utf-8') //throw catch by gameService
    const xmlParser = new xml.XMLParser(xmlParserOptions);
    const xmlObject = xmlParser.parse(data);
    let totalMissed = 0;
    let totalCovered = 0;
    xmlObject.report.package.sourcefile.forEach(element => {
        totalMissed += Number(element.counter.find(e => e.properties.type == 'LINE').properties.missed);
        totalCovered += Number(element.counter.find(e => e.properties.type == 'LINE').properties.covered)
    })
    const total = totalMissed + totalCovered;
    return(totalCovered*100/total);
}

exports.getLineCoveragePercentageFromString = (data) => {    
    const xmlParser = new xml.XMLParser(xmlParserOptions);
    const xmlObject = xmlParser.parse(data);
    let totalMissed = 0;
    let totalCovered = 0;
    xmlObject.report.package.sourcefile.forEach(element => {
        console.log('missed = '+element.counter.find(e => e.properties.type == 'LINE').properties.missed)
        console.log('covered = '+element.counter.find(e => e.properties.type == 'LINE').properties.covered)
        totalMissed += Number(element.counter.find(e => e.properties.type == 'LINE').properties.missed);
        totalCovered += Number(element.counter.find(e => e.properties.type == 'LINE').properties.covered)
    })
    const total = totalMissed + totalCovered;
    return(totalCovered*100/total);
}