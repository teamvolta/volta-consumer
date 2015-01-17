var request = require('request');

var DiscoveryClient = function(){
  this.discoveryIp = 'http://104.40.181.157:8001';
};

DiscoveryClient.prototype.register = function(config){
  this.discoveryIp = config.discoveryIp;
  request({
    method: 'POST',
    url: this.discoveryIp + '/register',
    json: true,
    body: {
      ip: config.ip,
      id: config.id,
      role: config.role,
      subRole: config.subRole
    }
  }, function(err){
    if(err){
      console.log('Error registering with Discovery Server', err);
      setTimeout(this.register.bind(this, config), 2000);
    } else{
      console.log('Registered with Discovery Server');
    }
  }.bind(this))
};

DiscoveryClient.prototype.discover = function(role, subRole, cb){
  request({
    method: 'GET',
    url: this.discoveryIp + '/discover/' + role + '/' + subRole
  }, cb)
};

module.exports = DiscoveryClient;
