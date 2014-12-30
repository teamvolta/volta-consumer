exports.development = {};
exports.production = {};
exports.development.consumption = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5,
  // peakTimeStart1: '9',
  // peakTimeEnd1: '12',
  // peakTimeStart1: '18',
  // peakTimeEnd1: '22'
};

exports.development.consumerProduction = {
  port: 8004,
  systemIp: 'http://localhost:8003'
};

exports.production.consumption = {
  port: process.env.PORT,
  systemIp: 'http://gridsystemtest.azurewebsites.net/consumers', //to replace later
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5
};

exports.production.consumerProduction = {
  port: process.env.PORT
  // systemIp: 
};
