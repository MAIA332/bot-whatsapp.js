## Projeto integrador Whatsapp + API

* Script de resposta automatizada do WhatsApp usando NodeJS

Este é um projeto não oficial que não utiliza os recursos oficiais da API do whatsapp bussines, risco de **ban no número**

 ### dependências do projeto
 instale as dependências local do projeto para execultar o script!
 ```shell
  npm install
 ```

Documentação detalhada da biblioteca
 ```
 https://docs.wwebjs.dev/index.html
 ```

## Rotas: 

### Enviar uma mensagem via API:
Tipo: **POST**

Endpoint: ```/sendMessage```

Body:
```
{
    "message":"teste",
    "phone":"55119--------"
}
```
### Obter o status da configuração atual:
Tipo: **GET**

Endpoint: ```/configs```

## Comandos receptivos:

```
{
  "category":"group", # Valido apenas para grupos
  "command":"setGroup",
},
{
  "category":"group", # Valido apenas para grupos
  "command":"groupConfig",

}
```
---

Comando: ```setGroup```

Função: Definir o grupo de onde foi mandada essa mensagem como o grupo para envio de informação pelos endpoints

---

Comando: ```groupConfig```

Função: Visualizar a configuração atual

## Package.json
```
{
  "name": "bot-whatsapp",
  "version": "1.0.0",
  "description": "A bot to reply happy birthday message",
  "main": "bot.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/bot.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/thisiscleverson/bot-whatsapp-js.git"
  },
  "author": "Cleverson",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/thisiscleverson/bot-whatsapp-js/issues"
  },
  "homepage": "https://github.com/thisiscleverson/bot-whatsapp-js#readme",
  "dependencies": {
    "qrcode-terminal": "^0.12.0",
    "ts-node": "^10.9.2",
    "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js#webpack-exodus"
  }
}
```

> Updated by: https://github.com/MAIA332