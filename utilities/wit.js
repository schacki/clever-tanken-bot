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
  if(intents && result.entities && result.entities.intent) {
      for(const intent in intents) {
        const foundIndex = result.entities.intent.indexOf(intent.value)
        if(foundIndex != -1) {
          foundIntent = true
        }
      }
  }

  let values = {}
  if(entities && result.entities) {
    for (const entity in entities) {
      const value = result.entities[entity]
      if(value) {
        values[entity] = value
      }
    }
  }

  console.log(values)

  if((!entities || Object.keys(values).length == entities.length) && (!intents || foundIntent)) { return values }
  return null

}
