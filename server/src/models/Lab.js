class Lab {

    constructor(id,name,deadline,trace,expired,leaderboard,userResult,username) {
        this.id=id; //can set to fake value when creating, backend will overwrite it
        this.name=name;
        this.deadline=deadline;
        this.trace=trace;
        this.expired=expired; 
        this.leaderboard=leaderboard; //list of Result
        this.userResult=userResult;
        this.username=username; 
    }

}

module.exports = Lab;