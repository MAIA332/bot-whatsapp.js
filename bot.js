const Phrases = require('./phraselist.json') // ler o arquivo json com todas a frases para analisar
const qrcode = require('qrcode-terminal') 
const { Client, Status,LocalAuth } = require('whatsapp-web.js')
const express = require("express")
const path =  require('path')
const { Configs } = require('./schemas/setups.js');

let config = new Configs();

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

// Definição de variáveis
const verifications = [
    {
        conditions:(args)=>{
            if(args.reduce((accumulator, currentValue) => accumulator && currentValue, true)){
                return true
            }
        },
        action: async (message)=>{
            let user = await message.getContact();
            const myGroup = config.getGroup();

            try{
                await myGroup.sendMessage(`Hello @${user.id.user} you chat is setted to ${JSON.stringify(myGroup)}`, {
                    mentions: [user]
                });
            }
            catch(e){
                let chat = await message.getChat();

                config.setGroup(chat)
               
                await chat.sendMessage(`Hello @${user.id.user} you chat is setted to ${JSON.stringify(myGroup)}`, {
                    mentions: [user]
                });
                
                
            }
        }
    }
]

const findGroupByName = async function (name) {
    const group = await client.getChats().then(chats => {
      return chats.find(chat =>
        chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
      );
    });
    return group;
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

    if(message.body=="setGroup"){

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


