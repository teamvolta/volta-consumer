var simulation = function(config) {
  this.config = config;
  // Defaults
  this.changedConsumption = false;
  this.bidTime = Date.now();  
  this.consumption = config.min;
  this.expectedConsumption = this.consumption;
};


simulation.prototype.bid = function(data, demandSystem, startTime, min, max) {
  var blockDuration = data.blockDuration;
  this.bidTime = Date.now() + blockDuration; // UTC date
  var simulateTime = startTime;
  this.changedConsumption = true;
  var expected = this.consumption;
  for(var i = 1000; i <= blockDuration; i+=1000) {
    simulateTime -= 1000;
    expected = this.timeBasedChange(expected, simulateTime, min, max);
  }

  this.expectedConsumption = expected;
  var bids = [{
    price: this.config.bidPrice,
    energy: demandSystem
  }];

  return bids;
};

simulation.prototype.currentConsumption = function(startTime, min, max) {
  
  if(this.changedConsumption && Date.now() > this.bidTime) {
    this.changedConsumption = false;
    this.consumption = this.expectedConsumption;
  } else {
    this.consumption = this.timeBasedChange(this.consumption, startTime, min, max);
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

simulation.prototype.changeConsumption = function (newConsumption) {
  this.consumption = newConsumption;
  this.expectedConsumption = newConsumption;
}

module.exports = simulation;
