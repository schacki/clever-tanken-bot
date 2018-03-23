const { TelegramBot, FileSessionStore } = require("bottender")
const { Telegram, Messenger } = require("./config.json")

let bot;
const arg = JSON.parse(process.env.npm_config_argv)
if(arg.original.length > 1 && arg.original[0] == "run" &&  arg.original[1] == "dev") {
    bot = new ConsoleBot()
} else {
    bot = new TelegramBot({
        accessToken: Telegram.accessToken,
        sessionStore: new FileSessionStore()
     })
}

exports.Bot = bot
