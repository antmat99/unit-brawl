class Solution {

    constructor(user_id, lab_id, rootPackagesUsername) {
        this.user_id=user_id; //number
        this.lab_id=lab_id; //number
        this.rootPackagesUsername=rootPackagesUsername; //string, cover to username folder
    }

    get pathToTestFolder(){
        return this.pathToTestFolder+'/src/main/test';
    }

    get pathToJavaFolder(){
        return this.pathToJavaFolder+'/src/main/java';
    }

}

module.exports = Solution;