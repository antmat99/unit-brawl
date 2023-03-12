class Lab {

    constructor(name,deadline,trace,expired,leaderboard,userResult,username,id,testMaxNumber) {
        this.name=name;
        this.deadline=deadline;
        this.trace=trace;
        this.expired=expired; 
        this.leaderboard=leaderboard; 
        this.userResult=userResult;
        this.username=username; 
        this.id = id;
        this.testMaxNumber=testMaxNumber;
    }

}

/*

leaderboard example

const leaderboard = [
        new Result('Lab 1', true, 1523, 1, 'mario','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 2, 'luigi','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 3, 'wario','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 4, 'peach','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 5, 'waluigi','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 6, 'toad','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 7, 'bowser','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 8, 'DK','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1523, 9, 'koopa','/images/neil_watts_placeholder.png'),
        new Result('Lab 1', true, 1321, 10, 'daisy','/images/neil_watts_placeholder.png')
    ]

*/

export default Lab;