// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');

var simulation = function (config) {
  this.config = config;
  this.bidTime = Date.now(); // Default 
}

simulation.prototype.bid = function(data) {
  this.bidTime = data.blockStart;
}









var config = require('./config');
var bid = config.midConsumption;
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
// var bidTime = Date.now();

// exports.bid = function (data) {
//   bidTime = data.blockStart;
//   var bidHours = Date(bidTime)).slice(16,18);
  // time = UTC milliseconds, result of Date.now()
  // Simulating demand according to the time of the day
  if(bidHours > config.peakTimeStart1 && bidHours < config.peakTimeEnd1  ||
     bidHours > config.peakTimeStart2 && bidHours < config.peakTimeEnd2) {
      bid = config.maxConsumption - (Math.random() * config.bidDeviation);
      return bid;
  } else {
    bid = config.midConsumption + (Math.random() * config.bidDeviation);
    return bid;
  }
};

exports.currentConsumption = function() {
  if(Date.now() > bidTime) {
    consumption = bid;
  }
  return consumption;
};
