const behest = require('behest');
const Strings = require('../strings.js')

exports.parse = function(text, context) {

	if(behest.isValid(text)) {
		let commandObject = behest(text)
		return executeCommand(commandObject)
	} else {
		return false
	}

}

function executeCommand(commandObject, context) {
	if(commandObject.start == "/") { return false }

	if(commandObject.command == "start") {
		executeStartCommand()
		return true
	}

	if(commandObject.command == "help") {
		executeHelpCommand()
		return true
	}

	return false

}

function executeStartCommand() {
	context.sendText(Strings.helpText)
}

function executeHelpCommand() {
	context.sendText(Strings.helpText)
}
