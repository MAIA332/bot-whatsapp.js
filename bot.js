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

const findGroupByName = async function (name) {
    const group = await client.getChats().then(chats => {
      return chats.find(chat =>
        chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
      );
    });
    return group;
}

const setTemplateEcho = async function (args){
    let message = `Hello @${args[0]} you chat is setted to ${JSON.stringify(args[1])}\n\n${args[2]}`
    return message
}

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

// Definição de variáveis condicionais
const verifications = [
    {
        conditions:(args)=>{
            if(args.reduce((accumulator, currentValue) => accumulator && currentValue, true)){
                return true
            }
        },
        action: async (message,comand,chat,user)=>{
                 
            //===========================
            await comand[0].function(chat)

            try{
                
                //==========================
                const myGroup = config.getGroup();
                //==========================
                const message =  await setTemplateEcho([user.id.user,myGroup,"Configurations has been changed"])
                //=========================

                
                await myGroup.sendMessage(message, {
                    mentions: [user]
                });
            }
            catch(e){

                //==========================
                const message =  await setTemplateEcho([user.id.user,chat,"Configurations has been keeped"])
                //=========================

                
                config.setGroup(chat)
               
                await chat.sendMessage(message, {
                    mentions: [user]
                });
                
                
            }
        }
    }
]


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

    let chat =  await message.getChat()
    let comand = commands.filter(item=>item.command == message.body)
    let user = await message.getContact();

    console.log(`Message identified on ${chat}, command identified ${comand} with label ${message.body} by contact ${user.id.name}`);

    for (const intent of verifications) {
        
        if(intent.conditions([chat.isGroup,comand.length>=1])){
            await intent.action(message,comand,chat,user)
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

app.post('/sendMessage', async (req, res) => {//message
    
    console.log("Enviando mensagem...");
    let myGroup = config.getGroup();

    try{
        await myGroup.sendMessage(`@${req.body.phone}:${req.body.message}`, {
            mentions: [`${req.body.phone}@c.us`]
        });

        res.send(true)
    }
    catch(e){
        res.send(false)
    }

    
    
});

app.get('/configs', async (req, res) => {
    console.log("Buscando configurações...");
    res.json(config); // Envia as configurações como JSON
});

client.initialize()

// Inicia o servidor
const PORT = 7000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


