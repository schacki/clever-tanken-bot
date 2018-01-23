exports.welcomeText = 'Willkommen bei Clever-Tanken. Ich kann dir sagen wie hoch die Benzinpreise in deiner Stadt sind.';
exports.helpText = 'Frag, "Wie teuer ist Super E5 in München?" und ich finde für dich heraus wie hoch der Super E5 Preis in München aktuell ist. Du kannst natürlich auch nach anderen Spritsorten oder Städten fragen.';
exports.UNKNOWN_TEXT = 'Leider konnte ich dich nicht verstehen benutzte /help Kommand um zu sehen wie du mit mit Reden kannst.';
exports.UNKNOWN_FUELTYPE_TEXT = "Tut mir leid, ich kenne die Spritsorte nicht.";
exports.UNKNOWN_CITY_TEXT = "Tut mir leid, ich kenne die Stadt nicht.";

exports.NO_PRICE_FOUND_TEXT = function(fuelType, city) {
  return 'Ich habe keinen Preis für ' + fuelType + ' in ' + city + ' gefunden.';
}

exports.UNKNOWN_FUELTYPE_TEXT = function(fuelType) {
  return 'Leider kenne ich die Spritsorte ' + fuelType + ' nicht.';
}

exports.UNKNOWN_CITY_TEXT = function(city) {
  return 'Leider kenne ich die Stadt ' + city + ' nicht.';
}

exports.resultTextMinMaxPrice = function(fuelType, city, minPrice, maxPrice) {
  return fuelType + ' kostet aktuell in ' + city + ' zwischen ' + minPrice + ' und ' + maxPrice + ' pro Liter.';
}

exports.resultTextPrice = function(fuelType, city, price) {
  return 'Der Preis für ' +  fuelType + ' in ' + city + ' kostet ' + price + ' Euro';
}
