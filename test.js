const { Wit } = require("./utilities")

Wit.fetchTextInfo("wie teuer ist diesel in berlin")
.then(result => {
    let searchForFuelStationValues = Wit.findMatch(result, ["fuelType", "location"])
})