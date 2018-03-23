const behest = require('behest');
const Strings = require('../strings.js')

exports.parse = function(text, context) {

	if(behest.isValid(text)) {
		console.log("command valid")
		const commandObject = behest(text)
		return executeCommand(commandObject, context)
	} else {
		return false
	}

}

function executeCommand(commandObject, context) {
	
	if(commandObject.start != "/") { return false }

	console.log("execute command valid")

	if(commandObject.command == "start") {
		executeStartCommand(context)
		return true
	}

	if(commandObject.command == "help") {
		executeHelpCommand(context)
		return true
	}

	return false

}

function executeStartCommand(context) {
	context.sendText(Strings.helpText)
}

function executeHelpCommand(context) {
	context.sendText(Strings.helpText)
}
