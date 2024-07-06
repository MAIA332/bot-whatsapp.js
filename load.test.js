
class Configs{
    constructor(){
        
        this.groupOf = {
            "Name":"Notion - teste",
            "objeto":[]
        }
    }

    getGroup(){
        return this.groupOf;
    }

    setGroup(group){
        this.groupOf = group
    }
}

let config = new Configs();

console.log(config.getGroup());

config.setGroup({Name:"Teste",objeto:{}})

console.log(config.getGroup());
