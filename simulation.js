// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');
var bid = config.midConsumption;
var bidTime = Date();
var consumption = bid;

exports.bid = function (data) {
  bidTime = data.timeslot.slice(16,18);  // UTC date
  // Simluating demand according to the time of the day
  if(bidTime > '9' && bidTime < '22'){
    if(bidTime < '12' && bidTime > '18') {
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
  if(Date() > bidTime) {
    consumption = bid;
  }
  return consumption;
}
