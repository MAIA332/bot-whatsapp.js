const Phrases    = require('./phraselist.json') // ler o arquivo json com todas a frases para analisar
const qrcode     = require('qrcode-terminal') 
const { Client, Status,LocalAuth } = require('whatsapp-web.js')
//var groupOf = require('./group.json');
const express = require("express")
const path =  require('path')

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


const app = express();
app.use(express.json());

// Inicializações =>
const client = new Client({
    puppeteer: {
        authStrategy: new LocalAuth(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions', '--disable-gpu']
    },
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', }
});


const findGroupByName = async function (name) {
    const group = await client.getChats().then(chats => {
      return chats.find(chat =>
        chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
      );
    });
    return group;
  }


let config = new Configs();

//functions
const getHours = () => {
    let currentTime = new Date()
    return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
}


const checkMessage = (Msg, contact) => {
    let msg = Msg.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

    for(let index in Phrases['phrases']){
        //console.log(msg,':', msg.indexOf(Phrases['phrases'][index]))
        if (msg.indexOf(Phrases['phrases'][index]) != -1) {
            console.log(" ")    
           	console.log(`📩 mensagem [ ${getHours()} ] por ${contact}: ${Msg}`)
		    console.log("🔎 palavra chave: "+Phrases['phrases'][index])
		return true
        }
    }
    
    return false
}   


const answers = () => {
    let index = Math.floor(Math.random() * (Phrases['answers'].length - 1) + 1) // sortear qual frase de resposta vai ser usada
    return Phrases['answers'][index]   
}


client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});


client.on('ready', () => {
    console.log('> Anton pronto para ação ✅ ')
})


client.on('message', async message => {
    let contact = await message.getContact()
    console.log(contact);

    if (message.body ==  "mention") {
        console.log("IS mention");

        const chat = await message.getChat();
        
        let user = await message.getContact();

        
        console.log(`Recebido uma mensão no grupo: ${chat} pelo usuário ${user.id.user}`);

        //console.log(await findGroupByName("Notion - teste"));
        
        await chat.sendMessage(`Hello @${user.id.user}`, {
            mentions: [user]
        });
    }
    else if(message.body=="setGroup"){

        console.log("finding chat...");

        const chat = await message.getChat();

        if(chat.isGroup == true){
            console.log("Setting group...");
            config.setGroup(chat)
            
            let user = await message.getContact();

            console.log("Getting group");
            let myGroup = config.getGroup()
            
            console.log(`Recebido uma mensão no grupo: ${myGroup} pelo usuário ${user.id.user}`);

            await chat.sendMessage(`Hello @${user.id.user} you chat is setted to ${JSON.stringify(myGroup)}`, {
                mentions: [user]
            });
        }
        else{
            await chat.sendMessage(`Esse comando é apenas para grupos`);
        }
        
    }
    else if(message.body=="groupConfig"){

        const myGroup = config.getGroup();
        let user = await message.getContact();

        try{
            await myGroup.sendMessage(`Hello @${user.id.user} you chat is setted to ${JSON.stringify(myGroup)}`, {
                mentions: [user]
            });
        }
        catch(e){
            let chat = await message.getChat();

            if(chat.isGroup == true){
                await chat.sendMessage(`Hello @${user.id.user} you chat is setted to ${JSON.stringify(myGroup)}`, {
                    mentions: [user]
                });
            }
            else{
                await chat.sendMessage("Esse comando é apenas para grupos");
            }
            
        }
        
    }
    else{
        if(checkMessage(message.body, contact.pushname) == true){
        
            try{
                
                
                await message.reply(answers())
                
                
    
            }catch(err){
                console.log(`> ❗ O Anton teve um ploblema a responder ${contact.pushname} as [ ${getHours()} ]`)
                console.log(`> 📩 mensagem recebida: ${message.body}`)
            }
        }
    }
    
})

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('auth_failure', (msg) => {
    console.error('AUTHENTICATION FAILURE', msg);
});

//Configurações do express

// Configura a rota raiz para exibir a página HTML
app.get('/', async (req, res) => {
    console.log("root acionado");
    res.sendFile(path.join(process.cwd(), 'web', 'index.html'));
});

app.post('/sendMessage', async (req, res) => {
    
    console.log("root acionado");
    let myGroup = config.getGroup();

    try{
        await myGroup.sendMessage(`Hello @${req.body.phone} you chat is setted to ${JSON.stringify(myGroup)}`, {
            mentions: [`${req.body.phone}@c.us`]
        });

        res.sendFile(path.join(process.cwd(), 'web', 'sucess.html'));
    }
    catch(e){
        res.sendFile(path.join(process.cwd(), 'web', 'error.html'));
    }

    
    
});

client.initialize()

// Inicia o servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


