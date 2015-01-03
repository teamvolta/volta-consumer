exports.development = {};
exports.production = {};
exports.client = {};

exports.development.consumer = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  brokerIp: 'http://localhost:8011/market',
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5,
  // Excess production beyond which consumer is ready to sell
  supplyMargin: 1
};

exports.development.consumerProducer = {
  port: 8006,
  consumerIp: 'http://localhost:8002/production',
  midProduction: 25
};

exports.development.client = {
  port: 8004
};

