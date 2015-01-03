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
  consumptionDeviation: 7,
  resetByPercentage: (this.maxConsumption - this.minConsumption) / 5 / 100, // When consumption crosses min/max
  // Energy beyond which consumer is ready to sell 
  supplyMargin: 5 // % of consumption
  // peakTimeStart1: '9',
  // peakTimeEnd1: '12',
  // peakTimeStart1: '18',
  // peakTimeEnd1: '22'
};

exports.development.consumerProducer = {
  port: 8006,
  consumerIp: 'http://localhost:8002/production',
  midProduction: 50
};

exports.development.client = {
  port: 8004
};


// PRODUCTION

exports.production.consumer = {
  clientPort: process.env.PORT,
  systemIp: 'http://gridsystemtest.azurewebsites.net/consumers',
  // brokerIp: ,
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5,
  // supplyMargin:
};

exports.production.consumerProducer = {
  port: process.env.PORT
  // consumerIp: ,
  // midProduction : 
};

exports.production.client = {
  port: process.env.PORT
};
