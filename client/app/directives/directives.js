angular.module('consumer.directives', [])
  .directive('consChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        Socket.on('data', function(data){
          console.log('receiving data');
        });

        var options = {
          chart: {
            renderTo: 'container1',
            type: 'line',
            marginRight: 10,
            events: {
              load: function(){
                var series = this.series[0];          
                // Socket.on('data', function(data){
                //   console.log('data received', data.currentConsumption)
                //   var consPoint = data.currentConsumption;
                //   series.addPoint(consPoint,true,true);
                // });
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
