angular.module('consumer.directives', [])
  .directive('consChart', ['Socket', '$rootScope', function(Socket, $rootScope) {
    console.log($rootScope.sockectOn, $rootScope.data);
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        // Socket.on('data', function(data){
        //   console.log('receiving data');
        // });

        var options = {
          chart: {
            renderTo: 'container1',
            type: 'area',
            marginRight: 10,
            events: {
              load: function(){
                console.log($rootScope.sockectOn, $rootScope.data)
                var currCons = this.series[0];
                var currProd = this.series[1];
                if ($rootScope.sockectOn === false) {
                  Socket.on('data', function(data){
                    console.log('data received', data.currentConsumption, data.currentProduction)
                    $rootScope.data = data;
                    currCons.addPoint($rootScope.data.currentConsumption,true,true);
                    currProd.addPoint($rootScope.data.currentProduction,true,true);
                  });
                  $rootScope.sockectOn = true;
                  console.log($rootScope.sockectOn, $rootScope.data.currentConsumption, $rootScope.data.currentProduction)
                } else {
                  console.log('got here')
                  setInterval(function() {
                    currCons.addPoint($rootScope.data.currentConsumption,true,true);
                    currProd.addPoint($rootScope.data.currentProduction,true,true);
                  }, 1000);
                }
              }
            }
          },
          title: {
            text: 'Current Consumption'
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'Energy Usage'
            },
            labels: {
              formatter: function() {
                return this.value + ' mW-h';
              }
            }
          },
          series: [{
            name:'currCons',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          },
          {
            name:'currProd',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          }]
        }

        var test = new Highcharts.Chart(options);
      }
    };
  }]);
