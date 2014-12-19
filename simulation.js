// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');

exports.currentConsumption = function () {
  var currentTime = Date();
  var time = currentTime.slice(16,18);  // 24 hour format

// Simluating demand according to the time of the day
  if(time > 9 && time < 22){
    if(time < 12 && time > 18) {
      return config.maxConsumption - (Math.random() * config.deviation);
    } else {
      return config.midConsumption + (Math.random() * config.deviation); 
    } 
  } else {
    return config.midConsumption - (Math.random() * config.deviation);
  }
}
