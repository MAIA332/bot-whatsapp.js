const { Configs } = require('./schemas/setups.js');

let configsInstance = new Configs();

const commands = [
    {
        "category":"group",
        "command":"setGroup",
        "function":async(chat)=>{
            console.log("Setting group...");
            config.setGroup(chat)
        }
    },
    {
        "category":"group",
        "command":"groupConfig",
        "function":async(arg)=>{
            console.log(true);
        }
    },
]

let comand = commands.filter(item=>item.command == "groupConfig")
comand[0].function(true)

/* const verifications = [
    {
        conditions:(args)=>{
            if(args.reduce((accumulator, currentValue) => accumulator && currentValue, true)){
                return true
            }
        },
        action: async ()=>{
            console.log("Verdade");
        }
    }
]

for (const intent of verifications) {
    if(intent.conditions([true,true])){
        intent.action()
    }
}

console.log(configsInstance.getGroup());

configsInstance.setGroup({Name:"Teste",objeto:{}})

console.log(configsInstance.getGroup());
 */