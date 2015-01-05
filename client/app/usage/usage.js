angular.module('usage', [])
  .controller('usageController', ['$scope', 'Socket', 'charts', function($scope, Socket, charts){
    
    var consumption = {
      options: {
        chart: {
          renderTo: 'container',
          type: 'line',
          marginRight: 10,
          events: {
            load: function(){
              var series = this.series[0];          
              Socket.on('data', function(data){
                console.log('data received', data.currentConsumption)
                var consPoint = data.currentConsumption;
                series.addPoint(consPoint,true,true);
              });
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
    };
      
    var test1 = charts.chart(consumption.options);

  }]);


  //add inputs for min and max cons prod
  //submit button; calls function that runs socket emit and pass data change to server
  //change values serverside
  //fix functions for more graphs in services
  //add socket.io events in graph functions
  //repeat for production