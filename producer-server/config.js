// Development Configurtion
exports.development = {

  port: 8006,
  consumerIp: 'http://localhost:8002',
  discoveryIp: 'http://104.40.181.157:8001',

  // For simulation
  min: 1,
  max: 100,
  majorDeviation: 6,
  // In ms. Should be same as consumer's!
  simulationTime: 60 * 1000
};

var producerProd = exports.development;
// When consumption crosses min/max
producerDev.resetByPercentage = (producerDev.max - producerDev.min) / 1000;
producerDev.minorDeviation = producerDev.majorDeviation/3;


//----------------------------------------------------


// Production Configuration
exports.production = {
  port: process.env.PORT,
  consumerIp: process.env.consumerIp,
  discoveryIp: 'http://104.40.181.157:8001',

  // For simulation
  min: process.env.min,
  max: process.env.max,
  majorDeviation: process.env.majorDeviation,
  // In ms. Should be same as consumer's!
  simulationTime: 60 * 1000
};

var producerProd = exports.production;
// When consumption crosses min/max
producerProd.resetByPercentage = (producerProd.max - producerProd.min) / 1000;
producerProd.minorDeviation = producerProd.majorDeviation/3;
