angular.module('consumer.directives', [])

  /*consumption chart*/
  .directive('consChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container1',
            type: 'spline',
            marginRight: 10,
            events: {
              load: function(){
                var currCons = this.series[0];
                var currProd = this.series[1];
                var reserve = this.series[2];
                Socket.on('consChart', function(data){
                  // console.log(data)
                  currCons.addPoint(scope.data.currentConsumption,true,true);
                  currProd.addPoint(scope.data.currentProduction,true,true);
                  // var prodSupply = data.currentProduction - (data.currentProduction*(data.supplyMarginPercent/100))
                  // reserve.addPoint(prodSupply,true,true);
                });
              }
            }
          },
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'Energy Usage and Production (mW-h)'
            },
            labels: {
              formatter: function() {
                return this.value + ' mW-h';
              }
            }
          },
          series: [{
            name:'Energy Usage',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          },
          {
            name:'Solar Production Reserve',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }()),
            color: '#ffff66'
          }/*,
          {
            name:'Solar Production Supply',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }()),
            color: '#f6546a'
          }*/
          ]
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
                var systemPrice = this.series[0];
                var brokerPrice = this.series[1];
                Socket.on('priceChart', function(data){
                  systemPrice.addPoint(scope.data.systemPrice,true,true);
                });
                Socket.onBrokerReceipt('priceChart', function(data){
                  brokerPrice.addPoint(scope.receiptData.price,true,true);
                });
              }
            }
          },
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'USD ($)'
            }
          },
          series: [{
            name:'Market price per mW-h',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          },
          {
            name:'Brokerage purchase price per mW-h',
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
                var usageCost = this.series[0];
                var prodRevenue  = this.series[1];
                var prod;
                Socket.on('costChart', function(data){
                  prod = scope.data.currentConsumption;
                  var cons = scope.data.currentConsumption;
                  var sysPrice = scope.data.systemPrice;
                  usageCost.addPoint(cons*sysPrice,true,true);
                });
                Socket.onBrokerReceipt('priceChart', function(data){
                  console.log('hello-------', prod);
                  var bkrPrice = scope.receiptData.price;
                  prodRevenue.addPoint(prod*bkrPrice,true,true);
                });
              }
            }
          },
          title: {
            text: null
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'USD ($)'
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
          },
          {
            name:'Production Revenue',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(Math.random());
              }
              return data;
            }())
          }
          ]
        }
  
        var incomeChart = new Highcharts.Chart(options);
      }
    };
  }])

