class Configs{
    constructor(){
        
        this.groupOf = {
            "Name":"Notion - teste",
            "objeto":{},
            "instancied":false
        }
    }

    getGroup(){
        return this.groupOf;
    }

    setGroup(group){
        this.groupOf = group
    }
}

module.exports = { Configs };