var simulation = function(config) {
  this.config = config;
  // Defaults
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

module.exports = simulation;
