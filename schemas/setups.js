class Configs{
    constructor(){
        
        this.groupOf = {
            "Name":"Notion - teste",
            "objeto":{},
            "instancied":false
        }

        this.commands = [
            {
                "category":"group",
                "command":"setGroup"
            },
            {
                "category":"group",
                "command":"groupConfig"
            },
        ]
    }

    getGroup(){
        return this.groupOf;
    }

    setGroup(group){
        this.groupOf = group
    }
}

module.exports = { Configs };