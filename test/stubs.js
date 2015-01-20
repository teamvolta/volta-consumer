// Development Configuration
exports.development = {
  
  port: 8002,
  discoveryIp: 'http://104.40.181.157:8001',
  
  // To register with discovery server
  ip: 'http://localhost:8002',
  id: Math.floor(Math.random() * 100000),
  role: 'consumer',
  subRole: 'consumer',

  // For simulation
  min: 1,  
  max: 100,
  majorDeviation: 7,
  // In ms. Should be same as consumer's producer!
  simulationTime: 60 * 1000, 
  // % of net of consumption and production beyond which consumer is ready to sell 
  supplyMargin: 2, 
  bidPrice: 100,
};

var consumerDev = exports.development;
// When consumption crosses min/max
consumerDev.resetByPercentage = (consumerDev.max - consumerDev.min) / 1000; 
consumerDev.minorDeviation = consumerDev.majorDeviation/3;