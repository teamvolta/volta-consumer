angular.module('consumer.filters', [])
  .filter('propercase', function() {
    return function(input) {
      if (input) {
        input = input.replace( /([A-Z])/g, " $1");
        return input.charAt(0).toUpperCase() + input.slice(1);
      }
    }  
  })
.filter('rename', function() {
    return function(input) {
      if (input) {
        if (input === 'AEB') {
          return 'Broker';
        } else {
          input = input.replace( /([A-Z])/g, " $1");
          return input.charAt(0).toUpperCase() + input.slice(1);
        }
      }
    }
  });