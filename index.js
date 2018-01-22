
const { TelegramBot } = require('bottender')
const { createServer } = require('bottender/express')
const Strings = require('./Strings.js');
const HTTPCleverTankenProvider  = require('./HTTPCleverTankenProvider.js');
const {Wit, log} = require('node-wit');

const config = require('./bottender.config.js')

const witClient = new Wit({
  accessToken: "XEIUUVCOS5OKC2MRNCKKMEQI6XTB3FFR",
  logger: new log.Logger(log.DEBUG) // optional
});


// Bot
const bot = new TelegramBot({
  accessToken: config.telegram.accessToken,
});

bot.onEvent(async context => {

	if(context.event.isText) {
		fetchTextInfo(context.event.text, context)
	} else {
		console.log("no event founded")
	}
 	
});


// Start the Server
const server = createServer(bot)
server.listen(process.env.PORT, () => {
  console.log("server is running on" + process.env.PORT + " port...")
});

// Functions

function fetchTextInfo(text, context) {
	witClient.message(text)
	.then((data) => {
		handleText(data, context)
	})
	.catch(console.error);
}

function handleText(result, context) {
  	let fuelType = result.entities.fuelType[0].value
	let location = result.entities.location[0].value		
	if(fuelType && location) {
		fetchFuelStationPrice(location, fuelType, context)
	} else {
		console.log("no entities founded")
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
              	context.sendText(Strings.resultTextPrice(fuelStation.fueltype, fuelStation.city, max))
              } else {
                context.sendText(Strings.resultTextMinMaxPrice(fuelStation.fueltype, fuelStation.city, min, max))
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