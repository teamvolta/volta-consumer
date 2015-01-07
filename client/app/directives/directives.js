angular.module('consumer.directives', [])

  /*consumption chart*/
  .directive('consChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container1',
            type: 'area',
            marginRight: 10,
            events: {
              load: function(){
                console.dir(scope);
                var currCons = this.series[0];
                var currProd = this.series[1];
                Socket.on('consChart', function(data){
                currCons.addPoint(data.currentConsumption,true,true);
                currProd.addPoint(data.currentProduction,true,true);
                });
              }
            }
          },
          title: {
            text: 'Current Consumption and Production'
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'Energy Usage and Production'
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

        var currentConsProdChart = new Highcharts.Chart(options);
      }
    };
  }])

  /*system price and brokerage price chart*/
  .directive('priceChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container2',
            type: 'line',
            marginRight: 10,
            events: {
              load: function(){
                console.dir(scope);
                var currCons = this.series[0];
                Socket.on('priceChart', function(data){
                currCons.addPoint(data.systemPrice,true,true);
                });
              }
            }
          },
          title: {
            text: 'Current Price'
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'USD'
            },
            labels: {
              formatter: function() {
                return this.value + ' $';
              }
            }
          },
          series: [{
            name:'Price per mW-h',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          }]
        }
  
        var systemPriceChart = new Highcharts.Chart(options);
      }
    };
  }])

  /*cost of consumption and production revenue chart*/
  .directive('costChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container3',
            type: 'column',
            marginRight: 10,
            events: {
              load: function(){
                console.dir(scope);
                var currPurchPrice = this.series[0];
                Socket.on('costChart', function(data){
                  var cons = data.currentConsumption;
                  var prod = data.currentConsumption;
                  var mktPrice = data.systemPrice;
                  currPurchPrice.addPoint(cons*mktPrice,true,true);
                });
              }
            }
          },
          title: {
            text: 'Usage Cost and Green Energy Production Revenue'
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'USD'
            },
            labels: {
              formatter: function() {
                return this.value + ' $';
              }
            }
          },
          series: [{
            name:'Usage Cost',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          }]
        }
  
        var incomeChart = new Highcharts.Chart(options);
      }
    };
  }])

