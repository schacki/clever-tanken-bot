
const { TelegramBot } = require('bottender')
const { createServer } = require('bottender/express')

const config = require('./bottender.config.js')

const bot = new TelegramBot({
  accessToken: config.telegram.accessToken,
});

bot.onEvent(async context => {
  await context.sendText(JSON.stringify(context))
});

const server = createServer(bot)

server.listen(process.env.PORT, () => {
  console.log("server is running on" + process.env.PORT + " port...")
});
