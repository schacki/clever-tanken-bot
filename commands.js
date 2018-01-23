const behest = require('behest');
const Strings = require('./Strings.js')

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
		context.sendText(Strings.helpText)
		return true
	}
	
	if(commandObject.command == "help") {
		context.sendText(Strings.helpText)
		return true
	}
	
	return false
}