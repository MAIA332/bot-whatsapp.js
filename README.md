## BOT WHATSAPP - JS

* Script de resposta automatizada do WhatsApp usando NodeJS

 # dependências do projeto
 instale as dependências local do projeto para execultar o script!
 ```shell
    npm install
 ```



 ```
 https://docs.wwebjs.dev/index.html
 ```

### Package.json
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