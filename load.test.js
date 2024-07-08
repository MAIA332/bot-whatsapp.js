const { Configs } = require('./schemas/setups.js');

let configsInstance = new Configs();

const verifications = [
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
