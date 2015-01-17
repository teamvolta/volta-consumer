var Q = require('q');
var discoveryClient = new (require('../discoverClient'));

exports.getIp = function(role, subRole, id) {
  var deferred = Q.defer();
  discoveryClient.discover(role, subRole, function(error, response) {
    if(error) { deferred.reject(error); }
    else {
      var parsedResponse = JSON.parse(response.body);
      parsedResponse.forEach(function(value) {
        console.log(value);
        if(value.id === id) {
          deferred.resolve(value.ip);
        }
      })
    }
  })
  return deferred.promise;
};
