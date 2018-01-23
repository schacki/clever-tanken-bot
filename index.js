
const { TelegramBot, MessengerBot} = require('bottender')
const { createServer } = require('bottender/express')
const {Wit, log} = require('node-wit');

const Strings = require('./Strings.js');
const HTTPCleverTankenProvider  = require('./HTTPCleverTankenProvider.js');
const commands = require('./commands.js')
const config = require('./bottender.config.js')

//Setup

var areIntlLocalesSupported = require('intl-locales-supported');

var localesMyAppSupports = [
   "de-DE"
];

if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and replace the constructors we need with the polyfill's.
        require('intl');
        Intl.NumberFormat   = IntlPolyfill.NumberFormat;
        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
}

// Wit
const witClient = new Wit({
  accessToken: "XEIUUVCOS5OKC2MRNCKKMEQI6XTB3FFR",
  logger: new log.Logger(log.DEBUG) // optional
})

// FacebookBot
const facebookBot = new MessengerBot({
  accessToken: config.messenger.accessToken,
  appSecret: config.messenger.appSecret
});

facebookBot.onEvent(async context => {

  	if(commands.parse(context.event.text)) { return }  
	
	if(context.event.isText) {
		fetchTextInfo(context.event.text, context)
	} else {
		console.log("no event found")
	}
	
});


// TelegramBot
const telegramBot = new TelegramBot({
  accessToken: config.telegram.accessToken,
});

telegramBot.setInitialState({
  searchRadius: 10
});

telegramBot.onEvent(async context => {

	if(commands.parse(context.event.text)) { return }  
	
	if(context.event.isText) {
		fetchTextInfo(context.event.text, context)
	} else {
		console.log("no event found")
	}
	
})


// Start the Server
const tServer = createServer(telegramBot)
/*tServer.listen(process.env.PORT, () => {
  console.log("server is running on" + process.env.PORT + " port...")
})*/

const fServer = createServer(facebookBot, {
  verifyToken: config.messenger.verifyToken
})
fServer.listen(process.env.PORT, () => {
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

	if(result.entities && result.entities.fuelType && result.entities.location) {
	
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