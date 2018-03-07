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
            const url = this.createPricesURL("variance", city, fuelType)
            console.log("request")
            console.log(url)
            request.get(url, function(error, response, body) {
            
                var result = JSON.parse(body)
                var isOk = response.statusCode == 200
                
                console.log("result")
                console.log(result)
                 if(isOk) { completionHandler(result) } else { errorHandler(result, error) }

             })
        })
    }

    createPricesURL(path, city, fuelType) {
        return this.url + "/prices/v" + this.version + "/" + path + "?user=" + this.username + "&pwd=" + this.password + "&city=" + city + "&fueltype=" + fuelType;
    }
}
