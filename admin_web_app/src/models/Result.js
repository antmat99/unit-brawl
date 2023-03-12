class Result {

    constructor(labName, completed, points, position,username,userAvatarLink) {
        this.labName = labName; //string
        this.completed = completed; //boolean, indica se l'utente ha PARTECIPATO al lab (non se l'ha completato)
        this.points = points; //number
        this.position = position; //number
        this.username=username //string
        this.userAvatarLink = userAvatarLink //string
    }
}

export default Result;