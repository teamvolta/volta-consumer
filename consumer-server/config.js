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
  bidPrice: 100
};

var consumerDev = exports.development;
// When consumption crosses min/max
consumerDev.resetByPercentage = (consumerDev.max - consumerDev.min) / 1000; 
consumerDev.minorDeviation = consumerDev.majorDeviation/3;


// ----------------------------------------------------------


// Production Configuration
exports.production = {
  port: process.env.PORT,
  discoveryIp: 'http://104.40.181.157:8001',
  
  // To register with discovery server
  ip: process.env.thisIP,
  id: Math.floor(Math.random() * 100000),
  role: 'consumer',
  subRole: 'consumer',

  // For simulation
  min: Number(process.env.min),  
  max: Number(process.env.max),
  majorDeviation: Number(process.env.majorDeviation),
  // In ms. Should be same as consumer's producer!
  simulationTime: 60 * 1000, 
  // % of net of consumption and production beyond which consumer is ready to sell 
  supplyMargin: Number(process.env.supplyMargin), 
  bidPrice: Number(process.env.bidPrice)
};

var consumerProd = exports.production;
// When consumption crosses min/max
consumerProd.resetByPercentage = (consumerProd.max - consumerProd.min) / 1000; 
consumerProd.minorDeviation = consumerProd.majorDeviation/3;