const { TelegramBot, FileSessionStore } = require("bottender")
const { Telegram, Messenger } = require("config.json")

// Telegram Bot
const bot = new TelegramBot({
  accessToken: Telegram.accessToken,
  sessionStore: new FileSessionStore()
})

exports.Bot = bot
