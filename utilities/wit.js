const { Wit, log } = require("node-wit")

const WitClient = new Wit({
  accessToken: "XEIUUVCOS5OKC2MRNCKKMEQI6XTB3FFR",
  logger: new log.Logger(log.DEBUG)
})

exports.fetchTextInfo = function(text) {
  return WitClient.message(text)
}

exports.findMatch = function(result, entities, intent) {

  let foundIntent = false
  if(intent && result.entities && result.entities[intent.name]) {
      for(intent in intent.intents) {
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
