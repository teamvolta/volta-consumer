exports.development = {
  port: 8002,
  systemIp: 'http://localhost:8000/consumers',
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5
};

exports.production = {
  port: process.env.PORT,
  systemIp: 'http://95.25.87.120:8000/consumers', //to replace later
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5
};
