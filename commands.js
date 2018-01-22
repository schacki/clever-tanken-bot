const commander = require('bot-commander')
const Strings = require('./Strings.js')

commander
.command('start')
.action( meta => {
  commander.send(meta, Strings.helpText)
})
  
exports.commander = commander
exports.parse = function(text, context) {
	commander.parse(text)
}