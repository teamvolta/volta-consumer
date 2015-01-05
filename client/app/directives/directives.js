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
            type: 'line',
            marginRight: 10,
            events: {
              load: function(){
                console.log($rootScope.sockectOn, $rootScope.data)
                var series = this.series[0];
                if ($rootScope.sockectOn === false) {
                  Socket.on('data', function(data){
                    console.log('data received', data.currentConsumption)
                    $rootScope.data = data;
                    series.addPoint($rootScope.data.currentConsumption,true,true);
                  });
                  $rootScope.sockectOn = true;
                  console.log($rootScope.sockectOn, $rootScope.data.currentConsumption)
                } else {
                  console.log('got here')
                  setInterval(function() {
                    series.addPoint($rootScope.data.currentConsumption,true,true);
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
            name:'cons',
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
