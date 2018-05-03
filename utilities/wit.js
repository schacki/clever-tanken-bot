const { Wit, log } = require("node-wit")

const WitClient = new Wit({
  accessToken: "HBGMNEFWMHTGHXQHUS2CP7AUQQ23TWQ2",
  logger: new log.Logger(log.DEBUG)
})

exports.fetchTextInfo = function(text) {
  return WitClient.message(text)
}

exports.findMatch = function(result, entities, intents) {

  let foundIntent = false
  if(intents && result.entities && result.entities.intent) {
      for(intent in intents) {
        const foundIndex = result.entities.intent.indexOf(intent.value)
        if(foundIndex != -1) {
          foundIntent = true
        }
      }
  }

  let values = {}
  if(entities && result.entities) {
    for (index in entities) {
      const entity = entities[index]
      const value = result.entities[entity]
      if(value) {
        values[entity] = value
      }
    }
  }

  if((!entities || Object.keys(values).length == entities.length) && (!intents || foundIntent)) { 
    console.log("values")
    console.log(values)
    return values 
  }

  console.log("null")
  return null

}
