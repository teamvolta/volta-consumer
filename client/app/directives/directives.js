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
                var self = this;
                Socket.on('consChart', function(data){
                  // console.log(data)

                  currCons.addPoint(Math.round(scope.data.currentConsumption*100)/100,false,true);
                  currProd.addPoint(Math.round(scope.data.currentProduction*100)/100,false,true);
                  self.redraw();

                  // var prodSupply = data.currentProduction - (data.currentProduction*(data.supplyMarginPercent/100))
                  // reserve.addPoint(prodSupply,true,true);
                });
              }
            }
          },
          plotOptions: {
            spline: {
              dataLabels: {
                enabled: true
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
                data.push(0);
              }
              return data;
            }())
          },
          {
            name:'Solar Production Reserve',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#f2d007'/*'#ffff66'*/
          }/*,
          {
            name:'Solar Production Supply',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
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
            type: 'spline',
            marginRight: 10,
            events: {
              load: function(){
                var systemPrice = this.series[0];
                var brokerPrice = this.series[1];
                var self = this;
                Socket.on('priceChart', function(data){
                  systemPrice.addPoint(Math.round(scope.data.systemPrice*100)/100,false,true);
                  brokerPrice.addPoint(Math.round(scope.data.brokerPrice*100)/100,false,true);
                  self.redraw();
                });
                // Socket.onBrokerReceipt('priceChart', function(data){
                //   brokerPrice.addPoint(Math.round(data.price*100)/100,false,true);
                //   self.redraw();
                // });
              }
            }
          },
          plotOptions: {
            spline: {
              dataLabels: {
                enabled: true
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
                data.push(0);
              }
              return data;
            }())
          },
          {
            name:'Brokerage purchase price per mW-h',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#f6546a'
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
                var self = this;
                Socket.on('costChart', function(data){
                  var cons = scope.data.currentConsumption;
                  var sysPrice = scope.data.systemPrice;
                  var supplyBrkr = scope.data.supplyBroker;
                  var brokerBuyPrice = scope.data.brokerPrice;
                  usageCost.addPoint(Math.round(cons*sysPrice*100)/100,false,true);
                  prodRevenue.addPoint(Math.round(supplyBrkr*brokerBuyPrice*100)/100,false,true);
                  self.redraw();
                });
                // Socket.onBrokerReceipt('consChart', function(data){
                //   prodRevenue.addPoint(Math.round(prod*bkrPrice*100)/100,false,true);
                //   self.redraw();
                // });
              }
            }
          },
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
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
                data.push(0);
              }
              return data;
            }())
          },
          {
            name:'Production Revenue',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
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

