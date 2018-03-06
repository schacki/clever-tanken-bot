const { Wit, log } = require("node-wit")

const WitClient = new Wit({
  accessToken: "XEIUUVCOS5OKC2MRNCKKMEQI6XTB3FFR",
  logger: new log.Logger(log.DEBUG)
})

exports.fetchTextInfo = function(text) {
  return WitClient.message(text)
}

exports.findMatch = function(result, entities, intents) {

  let foundIntent = false
  if(!intents && result.entities && result.entities.intent) {
      for(intent in intents) {
        let foundIndex = result.entities.intent.indexOf(intent.value)
        if(foundIndex != -1) {
          foundIntent = true
        }
      }
  }

  let values = {};
  if(entities && result.entities) {
    for(entity in entities) {
      founded = result.entities[entity]
      if(founded) {
        values[entity] = founded.value
      }
    }
  }

  console.log("values")
  console.log(values)
  if((!entities || Object.keys(values).length == entities.length) && (!intents || foundIntent)) { return values }
  return null

}
