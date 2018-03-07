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

  console.log(entities)
  console.log(result.entities)

  let values = {}
  if(entities && result.entities) {
    for(entity in entities) {
      value = result.entities[entity]
      console.log(value)
      if(value) {
        console.log("founded")
        values[entity] = value
      }
    }
  }

  console.log(values)

  if((!entities || Object.keys(values).length == entities.length) && (!intents || foundIntent)) { return values }
  return null

}
