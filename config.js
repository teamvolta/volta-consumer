exports.development = {};
exports.production = {};
exports.client = {};

exports.development.consumer = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  brokerIp: 'http://localhost:8011/market',
  accountIp: 'http://localhost:8010/subscriptions',
  consumerId: Math.random().toString(36).substr(2),
  min: 1,  
  max: 100,
  majorDeviation: 7,
  simulationTime: 60 * 1000, // In ms. Should be same as consumerProducer's!
  // Energy beyond which consumer is ready to sell 
  supplyMargin: 5, // % of consumption
  bidPrice: 10,
  // For discovery server
  discoveryIp: 'http://104.40.181.157:8001',
  ip: 'http://localhost:8002',
  id: Math.floor(Math.random() * 1000),
  role: 'consumer',
  subRole: 'consumer'
  // peakTimeStart1: '9',
  // peakTimeEnd1: '12',
  // peakTimeStart2: '18',
  // peakTimeEnd2: '22'
};
var consumerDev = exports.development.consumer;
consumerDev.mid = (consumerDev.max + consumerDev.min) / 2;
consumerDev.resetByPercentage = (consumerDev.max - consumerDev.min) / 10 / 100, // When consumption crosses min/max
consumerDev.minorDeviation = consumerDev.majorDeviation/3;


exports.development.consumerProducer = {
  port: 8006,
  consumerIp: 'http://localhost:8002/production',
  discoveryIp: 'http://104.40.181.157:8001',
  min: 0,
  max: 150,
  majorDeviation: 7,
  resetByPercentage: 1,
  simulationTime: 60 * 1000, // In ms. Should be same as consumer's!
};

var producerDev = exports.development.consumerProducer;
producerDev.mid = (producerDev.max + producerDev.min) / 2;
producerDev.minorDeviation = producerDev.majorDeviation/3;

exports.development.client = {
  port: 8004
};



// PRODUCTION

exports.production.consumer = {
  clientPort: process.env.PORT,
  systemIp: 'http://gridsystemtest.azurewebsites.net/consumers',
  // brokerIp: ,
  // accountIp: ,
  consumerId: Math.random().toString(36).substr(2),
  min: 1, // Cannot be/Do not put 0 inplace of 1
  mid: 50,
  max: 100,
  deviation: 7,
  // supplyMargin: ,
  // bidPrice: 
};

exports.production.consumerProducer = {
  port: process.env.PORT
  // consumerIp: ,
  // mid : 
};

exports.production.client = {
  port: process.env.PORT
};
