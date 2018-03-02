
const { Wit } = require("../../utilities")
const { CTProvider } = require("../../provider");
const Strings = require("../strings.js")

exports.handle = function(context) {
    if (context.event.isText) {
        Wit.fetchTextInfo(context.event.text)
        .then(data => {
            handleText(data, context)
        })
        .catch(console.error)
      } else {
        console.log("no event found");
      }
}

function handleText(result, context) {

    let searchForFuelStationValues = Wit.findMatch(result, ["fuelType", "location"])
    let setSearchRadiusValues = Wit.findMatch(result, ["number", "intent"], ["setSearchRadius"])
    let getSearchRadiusValues = Wit.findMatch(result, null, ["getSearchRadius"])
  
    if(searchForFuelStationValues != null) {
      console.log(searchForFuelStationValues["location"])
      let location = searchForFuelStationValues["location"][0].value
      let fuelType = searchForFuelStationValues["fuelType"][0].value
      fetchFuelStationPrice(location, fuelType, context);
    } else if(setSearchRadiusValues) {
      let radius = setSearchRadiusValues["number"][0].value;
      context.setState({ searchRadius: radius });
      context.sendText(Strings.SETED_RADIUS(radius));
    } else if(setSearchRadiusValues) {
      context.sendText(Strings.GET_RADIUS(context.state.searchRadius));
    } else {
      context.sendText(Strings.UNKNOWN_TEXT);
    }
   
  }

  function fetchFuelStationPrice(city, fuel, context) {

    CTProvider.getFuelStationPrices(city, fuel)
    .then(response => {

      var min = Number(response.price_min)
        var max = Number(response.price_max)
  
        min = min.toString()
        min = min.slice(0, min.indexOf(".") + 3)
        min = Number(min)
  
        max = max.toString()
        max = max.slice(0, max.indexOf(".") + 3)
        max = Number(max)
  
        if (min == max) {
          let maxString = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
          }).format(max);
          context.sendText(
            Strings.resultTextPrice(
              response.fueltype,
              response.city,
              maxString
            )
          );
        } else {
          let maxString = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
          }).format(max);
          let minString = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
          }).format(min);
          context.sendText(
            Strings.resultTextMinMaxPrice(
              response.fueltype,
              response.city,
              minString,
              maxString
            )
          )
        }
    })
    .catch(response, error => {
      if (response.reason == "UNKNOWN_FUELTYPE") {
        if (fuel == undefined) {
          context.sendText(Strings.UNKNOWN_FUELTYPE_TEXT);
        } else {
          context.sendText(Strings.UNKNOWN_FUELTYPE_TEXT(fuel));
        }
      } else if (response.reason == "UNKNOWN_CITY") {
        if (city == undefined) {
          context.sendText(Strings.UNKNOWN_CITY_TEXT);
        } else {
          context.sendText(Strings.UNKNOWN_CITY_TEXT(city));
        }
      } else if (response.reason == "NO_PRICE_FOUND") {
        context.sendText(Strings.NO_PRICE_FOUND_TEXT(fuel, city));
      } else {
        context.sendText(Strings.UNKNOWN_TEXT);
      }
    })
     
  }
  