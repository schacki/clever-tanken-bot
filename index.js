
const { TelegramBot } = require('bottender')
const { createServer } = require('bottender/express')
const {Wit, log} = require('node-wit');

const Strings = require('./Strings.js');
const HTTPCleverTankenProvider  = require('./HTTPCleverTankenProvider.js');
const commands = require('./commands.js')
const config = require('./bottender.config.js')


// Wit
const witClient = new Wit({
  accessToken: "XEIUUVCOS5OKC2MRNCKKMEQI6XTB3FFR",
  logger: new log.Logger(log.DEBUG) // optional
});


// Bot
const bot = new TelegramBot({
  accessToken: config.telegram.accessToken,
});

bot.setInitialState({
  searchRadius: 10
});

bot.onEvent(async context => {

	commands.commander.setSend(function(meta, message) {
		context.sendText(message)
	})
	
	console.log(commands.commander.parse(context.event.text))
	
	if(context.event.isText) {
		fetchTextInfo(context.event.text, context)
	} else {
		console.log("no event founded")
	}
})


// Start the Server
const server = createServer(bot)
server.listen(process.env.PORT, () => {
  console.log("server is running on" + process.env.PORT + " port...")
})

// Functions

function fetchTextInfo(text, context) {
	witClient.message(text)
	.then((data) => {
		handleText(data, context)
	})
	.catch(console.error);
}

function handleText(result, context) {

	if(result.entities && result.entities.fuelTyp && result.entities.location) {
	
		let fuelType = result.entities.fuelType[0].value
		let location = result.entities.location[0].value		
		if(fuelType && location) {
			fetchFuelStationPrice(location, fuelType, context)
		}
		
	} else {
		context.sendText(Strings.helpText)
	}
	
}

function fetchFuelStationPrice(city, fuel, context) {

	
	context.typing(3000)
		
 	HTTPCleverTankenProvider.getFuelStationPrices(city, fuel, function(isOK, fuelStation) {
			console.log("getFuelStationPrices callback")
          if(isOK) {

              var min = Number(fuelStation.price_min);
              var max = Number(fuelStation.price_max);

              min = min.toString();
              min = min.slice(0, (min.indexOf("."))+3);
              min = Number(min);

              max = max.toString();
              max = max.slice(0, (max.indexOf("."))+3);
              max = Number(max);

              if(min == max) {
              	let maxString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(max)
              	context.sendText(Strings.resultTextPrice(fuelStation.fueltype, fuelStation.city, maxString))
              } else {
             	 let maxString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(max)
             	 let minString = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(min)
                context.sendText(Strings.resultTextMinMaxPrice(fuelStation.fueltype, fuelStation.city, minString, maxString))
              }

          } else {

              if(fuelStation.reason == "UNKNOWN_FUELTYPE") {

                if(fuel == undefined) {
                	context.sendText(Strings.UNKNOWN_FUELTYPE_TEXT)
                } else {
                	context.sendText(Strings.UNKNOWN_FUELTYPE_TEXT(fuel))
                }

              } else if(fuelStation.reason == "UNKNOWN_CITY") {

                if(city == undefined) {
                	context.sendText(Strings.UNKNOWN_CITY_TEXT)
                } else {
                	context.sendText(Strings.UNKNOWN_CITY_TEXT(city))
                }

              } else if(fuelStation.reason == "NO_PRICE_FOUND") {
              	 context.sendText(Strings.NO_PRICE_FOUND_TEXT(fuel, city))
              } else {
              	 context.sendText(Strings.UNKNOWN_TEXT)
              }

          }

      })
}