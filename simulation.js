// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');
var bid = config.midConsumption;
var bidTime = Date();
var consumption = bid;
reporter.register('consumption', function(){return {bidTime: bidTime, consumption: consumption, bid: bid}});
exports.bid = function (data) {
  var time = data.blockStart;  // UTC date
  var bids = [{
    price: 10,
    energy: 10
  }];

  reporter.report('bids', function(){return bids});
  return bids;
  // time = UTC milliseconds, result of Date.now()
// Simulating demand according to the time of the day
  // if(time > '9' && time < '22'){
  //   if(time < '12' && time > '18') {
  //     bid = config.maxConsumption - (Math.random() * config.bidDeviation);
  //     return bid;
  //   } else {
  //     bid = config.midConsumption + (Math.random() * config.bidDeviation);
  //     return bid;
  //   }
  // } else {
  //   bid = config.midConsumption - (Math.random() * config.bidDeviation);
  //   return bid;
  // }
};

exports.currentConsumption = function() {
  if(Date() > bidTime) {
    consumption = bid;
  }
  return consumption;
};
