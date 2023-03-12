class Result {

    constructor(labName, completed, points, position,username,userAvatarLink) {
        this.labName = labName; //string
        this.completed = completed; //boolean, true if user JOINED the lab (not if she completed it)
        this.points = points; //number
        this.position = position; //number
        this.username=username //string
        this.userAvatarLink = userAvatarLink //string
    }
}

module.exports = Result;