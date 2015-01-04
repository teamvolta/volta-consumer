var simulation = function(config) {
  this.config = config;
  // Defaults
  this.bidTime = Date.now();  
  this.consumption = config.midConsumption;
};

// reporter.register('consumption', function(){return {bidTime: bidTime, consumption: consumption, bid: bid}});


simulation.prototype.bid = function(data, demandSystem, startTime) {
  this.bidTime = data.blockStart; // UTC date
  this.expectedConsumption = timeBasedChange(this.consumption, startTime, this.config.minConsumption, this.config.maxConsumption);
  var bids = [{
    price: this.config.bidPrice,
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

simulation.prototype.deviate = function(number, deviation, min, max) {
  var deviateBy = deviation * Math.random();
  var deviatedNumber = number + (deviateBy);

  return checkForMinMax(deviatedNumber, min, max);
};

simulation.prototype.checkForMinMax = function(number, min, max) {
  var resetPercent = this.config.resetByPercent;

  if(number <= min) {
    return min + (min * resetPercent);
  } else if (number >= max) {
    return max - (max * resetPercent);
  } 

  return number;
};

simulation.prototype.timeBasedChange = function(number, startTime, min, max) {
  var simulationTime = this.config.simulationTime;
  var timeElapsed = Date.now - startTime;
  var stage = timeElapsed / simulationTime * 100;
  var majorDeviation = this.config.majorDeviation;
  var minorDeviation = this.config.minorDeviation;

  if(stage > 0 && stage <= 19) {
    return deviate(number, minorDeviation, min, max);
  } else if(stage > 19 && stage < 50) {
    return deviate(number, majorDeviation, min, max);
  } else if(stage >= 50 && stage <=60) {
    return deviate(number, minorDeviation, min, max);
  } else if(stage > 60 && stage < 90) {
    return deviate(number, -majorDeviation, min, max);
  } else if (stage >= 90 && stage < 100) {
    return deviate(number, -minorDeviation, min, max);
  } else {
    return number
  }

}

module.exports = simulation;
