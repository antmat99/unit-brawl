const path = require('path');

/**
 * Folders structure
 * 
 * root -> home folder
 * 
 * root/packages -> contains user's solutions
 * root/ideal_solution -> contains ideal solution
 * root/warzone -> here war is carried on
 * 
 * packages contains folder named by users' nicknames
 * each of them contains lab folder, which contains
 * src folder (with main/java and test/java) and pom.xml
 * 
 * ideal_solution contains src folder (with main/java and test/java) and pom.xml
 * target folder will be created inside it when tests are made
 * 
 * warzone contains src/main/java and src/test/java where to manage war
 * it will contain target folder after tests are made
 * 
 */

exports.root = path.normalize('./test');

exports.rootPackages = path.normalize('./test'+'/packages');

exports.rootIdealsolution = path.normalize('./test'+'/ideal_solution');

exports.rootWarzone = path.normalize('./test'+'/warzone');

exports.projectname = path.normalize('lab');

exports.rootIdealsolutionProjectname = path.normalize('./test'+'/ideal_solution/lab');

exports.rootWarzoneProjectname = path.normalize('./test'+'/warzone/lab');

exports.join = (pathBefore,pathAfter) => {
    return path.join(path.normalize(pathBefore),path.normalize(pathAfter));
}

exports.toAbsolutePath = (relativePath) => {
    if(relativePath.startsWith('.')){
        //remove ./
        relativePath = relativePath.slice(2);
    }
    return path.join(path.normalize('C:\\Users\\Utente\\Desktop\\tesi\\web_app\\server'),relativePath)
}
