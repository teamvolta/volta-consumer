exports.development = {};
exports.production = {};
exports.development.consumption = {
  clientPort: 8002,
  serverPort: 8004,
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
  port: 8006,
  systemIp: 'http://localhost:8004'
};


exports.production.consumption = {
  clientPort: process.env.PORT,
  // serverPort:
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
