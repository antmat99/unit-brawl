class Achievement {

    constructor(name, description, completed, badgeImagePath, completitionPercentage) {
       this.name=name; //string
       this.description=description; //string
       this.completed=completed; //boolean
       this.badgeImagePath=badgeImagePath; //string
       this.completitionPercentage=completitionPercentage; //number (from 0 to 100)
    }

}

export default Achievement;