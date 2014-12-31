var simulation = function (config) {
  this.config = config;
  // Defaults
  this.bidTime = Date.now();  
  this.consumption = config.midConsumption;
};

// reporter.register('consumption', function(){return {bidTime: bidTime, consumption: consumption, bid: bid}});


simulation.prototype.bid = function(data, demandSystem) {
  this.bidTime = data.blockStart; // UTC date
  this.expectedConsumption = Math.random * this.config.midConsumption;
  var bids = [{
    price: 10,
    energy: demandSystem
  }];

  // reporter.report('bids', function(){return bids});
  return bids;
};

simulation.prototype.currentConsumption = function() {
  if(Date.now() > this.bidTime) {
    this.consumption = this.expectedConsumption;
  }
  return this.consumption;
};

module.exports = simulation;

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
