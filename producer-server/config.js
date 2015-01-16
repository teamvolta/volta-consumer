// Development Configurtion
exports.development = {

  port: 8006,
  discoveryIp: 'http://104.40.181.157:8001',

  // For simulation
  min: 1,
  max: 100,
  majorDeviation: 6,
  // In ms. Should be same as consumer's!
  simulationTime: 60 * 1000,
};

var producerDev = exports.development;
// When consumption crosses min/max
producerDev.resetByPercentage = (producerDev.max - producerDev.min) / 1000;
producerDev.minorDeviation = producerDev.majorDeviation/3;


//----------------------------------------------------


// Production Configuration
exports.production = {
  port: process.env.PORT
};
