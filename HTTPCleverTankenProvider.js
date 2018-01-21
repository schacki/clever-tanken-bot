const request = require('request');

//config
const versionNumber = 1;

// credentials
const username = "alexa";
const password = ">A28RD=u$r^r3re:";

// urls
const baseURL = "https://secure.clever-tanken.de/api";

// Private Functions
function createPricesURL(path, city, fuelType) {
    return baseURL + "/prices/v" + versionNumber + "/" + path + "?user=" + username + "&pwd=" + password + "&city=" + city + "&fueltype=" + fuelType;
}

// Public Functions
exports.getFuelStationPrices = function(city, fuelType, context, callback) {
  if (process.env.MOCK_DATA === 'true') {
    const testJSON = require('./test.json');
    callback(true, testJSON, context);
  } else {
    request.get(createPricesURL("variance", city, fuelType), function(error, response, body) {

        var result = JSON.parse(body);
        var isOk = response.statusCode == 200;

        console.log(body);

        callback(isOk, result, context);

    })
  }
}
