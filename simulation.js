// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');
var bid = config.midConsumption;

exports.bid = function (data) {
  var time = data.time.slice(16,18);  // UTC date
// Simluating demand according to the time of the day
  if(time > '9' && time < '22'){
    if(time < '12' && time > '18') {
      bid = config.maxConsumption - (Math.random() * config.bidDeviation);
      return bid;
    } else {
      bid = config.midConsumption + (Math.random() * config.bidDeviation); 
      return bid;
    } 
  } else {
    bid = config.midConsumption - (Math.random() * config.bidDeviation);
    return bid;
  }
};


exports.currentConsumption = function() {
  return bid + (Math.random() * config.consumptionDeviation);
}