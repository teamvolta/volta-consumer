exports.development = {};
exports.production = {};
exports.client = {};

exports.development.consumer = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  brokerIp: 'http://localhost:8011/market',
  accountIp: 'http://localhost:8010/subscriptions',
  consumerId: Math.random().toString(36).substr(2),
  minConsumption: 1,  
  maxConsumption: 100,
  midConsumption: (this.maxConsumption + this.minConsumption) / 2,
  majorDeviation: 7,
  minorDeviation: this.majorDeviation/3,
  resetByPercentage: (this.maxConsumption - this.minConsumption) / 10 / 100, // When consumption crosses min/max
  simulationTime: 60 * 100, // In ms. Should be same as consumerProducer's!
  // Energy beyond which consumer is ready to sell 
  supplyMargin: 5, // % of consumption
  bidPrice: 10,
  // peakTimeStart1: '9',
  // peakTimeEnd1: '12',
  // peakTimeStart2: '18',
  // peakTimeEnd2: '22'
};

exports.development.consumerProducer = {
  port: 8006,
  consumerIp: 'http://localhost:8002/production',
  minProduction: 0,
  maxProduction: 150,
  midProduction: (this.maxProduction + this.minProduction) / 2,
  majorDeviation: 7,
  minorDeviation: this.majorDeviation/3,
  resetByPercentage: 1,
  simulationTime: 60 * 100, // In ms. Should be same as consumer's!
};

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
  minConsumption: 1, // Cannot be/Do not put 0 inplace of 1
  midConsumption: 50,
  maxConsumption: 100,
  consumptionDeviation: 7,
  // supplyMargin: ,
  // bidPrice: 
};

exports.production.consumerProducer = {
  port: process.env.PORT
  // consumerIp: ,
  // midProduction : 
};

exports.production.client = {
  port: process.env.PORT
};
