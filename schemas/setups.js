class Configs{
    constructor(){
        
        this.groupOf = []
    }

    getGroup(){
        return this.groupOf;
    }

    setGroup(group){
        this.groupOf.push(group)
    }
}

module.exports = { Configs };