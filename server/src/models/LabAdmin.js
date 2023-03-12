class LabAdmin {

    constructor(id,name,deadline,trace,expired,leaderboard,testMaxNumber,linkToIdealSolution) {
        this.id=id; //can set to fake value when creating, backend will overwrite it
        this.name=name;
        this.deadline=deadline;
        this.trace=trace;
        this.expired=expired; 
        this.leaderboard=leaderboard; //undefined if expired==false
        this.testMaxNumber=testMaxNumber;
        this.linkToIdealSolution=linkToIdealSolution;
    }

}

module.exports = LabAdmin