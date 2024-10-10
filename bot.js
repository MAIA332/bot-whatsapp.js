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
        authStrategy: new LocalAuth({
            clientId: "client-one"
        }),
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

const authorized_adms = ["5511930769312"]

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
            console.log(config.getGroup());
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

            //console.log(chat);
            
        }
    }
]


client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});


client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
});


client.on('ready', () => {
    console.log('> Anton pronto para ação ✅ ')
})


client.on('message', async message => {

    let chat =  await message.getChat()
    let comand = commands.filter(item=>item.command == message.body)
    let user = await message.getContact();

    for (const intent of verifications) {
        
        if(intent.conditions([chat.isGroup,comand.length>=1,authorized_adms.includes(user.id.user)])){
            console.log(`Message identified on ${chat.name}, command identified ${comand[0]} with label ${message.body} by contact ${user.id.user}`);
            //console.log(user.id);
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

    //===============================
    let targetGroup = req.body.group;

    let filtredGroup  = myGroup.filter(item=>item.name == targetGroup)
    console.log("FILTERED GROUP",filtredGroup);
    
    //===============================

    try{
        await filtredGroup[0].sendMessage(`@${req.body.phone}:${req.body.message}`, {
            mentions: [`${req.body.phone}@c.us`]
        });

        res.send(true)
    }
    catch(e){
        res.send(JSON.stringify(e.message))
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


