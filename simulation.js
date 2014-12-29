
var simulation = function (config) {
  this.config = config;
  this.bidTime = Date.now(); // Default 
  this.bid = config.midConsumption;
  this.consumption = bid;
};

reporter.register('consumption', function(){return {bidTime: bidTime, consumption: consumption, bid: bid}});

simulation.prototype.bid = function(data) {
  this.bidTime = data.blockStart; // UTC date
  var bids = [{
    price: 10,
    energy: 10
  }];

  reporter.report('bids', function(){return bids});
  return bids;
};

simulation.prototype.currentConsumption = function(energy) {
  if(Date.now() > this.bidTime) {
    this.consumption = energy;
  }
  return this.consumption;
}



// exports.bid = function (data) {
//   var bidHours = Date(bidTime)).slice(16,18);
  // time = UTC milliseconds, result of Date.now()
  // Simulating demand according to the time of the day
  // if(bidHours > config.peakTimeStart1 && bidHours < config.peakTimeEnd1  ||
  //    bidHours > config.peakTimeStart2 && bidHours < config.peakTimeEnd2) {
  //     bid = config.maxConsumption - (Math.random() * config.bidDeviation);
  //     return bid;
  // } else {
  //   bid = config.midConsumption + (Math.random() * config.bidDeviation);
  //   return bid;
  // }
// };
