exports.development = {};
exports.production = {};
exports.development.consumption = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  brokerIp: 'http://localhost:8011/market',
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5,
  // Energy beyond which consumer is ready to sell
  supplyMargin: 1
  // peakTimeStart1: '9',
  // peakTimeEnd1: '12',
  // peakTimeStart1: '18',
  // peakTimeEnd1: '22'
};

exports.development.consumerProduction = {
  port: 8006,
  consumerIp: 'http://localhost:8002',
  midProduction: 25
};


exports.production.consumption = {
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

exports.production.consumerProduction = {
  port: process.env.PORT
  // consumerIp: 
};
