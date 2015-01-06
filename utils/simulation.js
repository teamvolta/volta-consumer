var simulation = function(config) {
  this.config = config;
  // Defaults
  this.bidTime = Date.now();  
  this.consumption = config.mid;
  console.log('--------' + config.mid);
};

// reporter.register('consumption', function(){return {bidTime: bidTime, consumption: consumption, bid: bid}});


simulation.prototype.bid = function(data, demandSystem, startTime, min, max) {
  this.bidTime = data.blockStart; // UTC date
  this.expectedConsumption = this.timeBasedChange(this.consumption, startTime + data.blockDuration, min, max);
  var bids = [{
    price: this.config.bidPrice,
    energy: demandSystem
  }];

  // reporter.report('bids', function(){return bids});
  return bids;
};

simulation.prototype.currentConsumption = function(startTime, min, max) {
  if(Date.now() > this.bidTime) {
    this.consumption = this.expectedConsumption;
  }
  return this.timeBasedChange(this.consumption, startTime, min, max);
};

simulation.prototype.deviate = function(number, deviation, min, max) {
  var deviateBy = deviation * Math.random();
  var deviatedNumber = number + (deviateBy);

  return this.checkForMinMax(deviatedNumber, min, max);
};

simulation.prototype.checkForMinMax = function(number, min, max) {
  var resetPercent = this.config.resetByPercentage;

  if(number <= min) {
    return min + (min * resetPercent);
  } else if (number >= max) {
    return max - (max * resetPercent);
  } 

  return number;
};

simulation.prototype.timeBasedChange = function(number, startTime, min, max) {
  var simulationTime = this.config.simulationTime;
  var timeElapsed = Date.now() - startTime;
  // console.log('--------------  ' + timeElapsed);
  var stage = timeElapsed / simulationTime * 100;
  var majorDeviation = this.config.majorDeviation;
  var minorDeviation = this.config.minorDeviation;

  if(stage > 0 && stage <= 19) {
    return this.deviate(number, minorDeviation, min, max);
  } else if(stage > 19 && stage < 50) {
    return this.deviate(number, majorDeviation, min, max);
  } else if(stage >= 50 && stage <=60) {
    return this.deviate(number, minorDeviation, min, max);
  } else if(stage > 60 && stage < 90) {
    return this.deviate(number, -majorDeviation, min, max);
  } else if (stage >= 90 && stage < 100) {
    return this.deviate(number, -minorDeviation, min, max);
  } else {
    return number;
  }
};

module.exports = simulation;
