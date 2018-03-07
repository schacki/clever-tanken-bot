const Request = require('request');

exports.CTProvider = class CTProvider {

    constructor(url, username, password, version) {
        this.url = url
        this.username = username
        this.password = password
        this.version = version
    }

    getFuelStationPrices(city, fuelType) {
        return new Promise((completionHandler, errorHandler) => {
            request.get(this.createPricesURL("variance", city, fuelType), function(error, response, body) {
            
                var result = JSON.parse(body);
                var isOk = response.statusCode == 200;
            
                 if(isOk) { completionHandler(result) } else { errorHandler(result, error) }

             })
        })
    }

    createPricesURL(path) {
        return this.url + "/prices/v" + this.versionNumber + "/" + path + "?user=" + this.username + "&pwd=" + this.password + "&city=" + this.city + "&fueltype=" + this.fuelType;
    }
}
