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
            Request.get(url ,function(error, response, body) {
            
                var result = JSON.parse(body)
                var isOk = response.statusCode == 200
                
                console.log("result")
                console.log(result)
                 if(isOk) { completionHandler(result) } else { errorHandler(result, error) }

             }).auth('hackathon', 'hackathon2018$#')
        })
    }

    createPricesURL(path, city, fuelType) {
        return this.url + "/prices/v" + this.version + "/" + path + "?city=" + city + "&fueltype=" + fuelType;
    }
}
