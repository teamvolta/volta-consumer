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
                enabled: true,
                color: '#000000'
              }
            },
            series: {
              lineWidth: 3,
              shadow: true
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
            name:'Solar Production',
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
                enabled: true,
                color: '#000000'
              }
            },
            series: {
              lineWidth: 3,
              shadow: true
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
                enabled: true,
                color: '#000000'
              }
            },
            series: {
              pointWidth: 20,
              borderColor: '#333333',
              shadow: true
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
            }()),
            color: '#f75151'
          },
          {
            name:'Production Revenue',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#7eca67'
          }
          ]
        }
  
        var incomeChart = new Highcharts.Chart(options);
      }
    };
  }])

/*production aggregated column chart*/
  .directive('productionChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container4',
            type: 'column',
            marginRight: 10,
            events: {
              load: function(){
                var prodReserve  = this.series[0];
                var prodSupply  = this.series[1];
                var self = this;
                Socket.on('productionChart', function(data){
                  var currProd = scope.data.currentProduction;
                  var supplyBrkr = scope.data.supplyBroker;
                  var reserve = currProd - supplyBrkr;
                  prodReserve.addPoint(Math.round(reserve*100)/100,false,true);
                  prodSupply.addPoint(Math.round(supplyBrkr*100)/100,false,true);
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
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                color: '#000000'
              }
            },
            series: {
              pointWidth: 33,
              borderColor: '#333333',
              shadow: true
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
              text: 'Solar Production (mW-h)'
            }
          },
          series: [{
            name:'Production Reserve',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#f2d007'
          },
          {
            name:'Production Supply to Broker',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#ff5500'
          }]
        }
  
        var productionChart = new Highcharts.Chart(options);
      }
    };
  }])

/*production aggregated column chart*/
  .directive('usageChart', ['Socket', function(Socket) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var options = {
          chart: {
            renderTo: 'container5',
            type: 'column',
            marginRight: 10,
            events: {
              load: function(){
                var useSystem  = this.series[0];
                var useBroker  = this.series[1];
                var useReserve  = this.series[2];
                var self = this;
                Socket.on('usageChart', function(data){
                  var currProd = scope.data.currentProduction;
                  var currCons = scope.data.currentConsumption;
                  var fromSystem = scope.data.allotedBySystem;
                  var fromBroker = scope.data.allotedByBroker;
                  var fromReserve = scope.data.currentProduction;
                  var toBroker = scope.data.supplyBroker;
                  var reserveRate = scope.data.supplyMarginPercent;

                  if (currCons >= currProd) {
                    useSystem.addPoint(Math.round(fromSystem*100)/100,false,true);
                    useBroker.addPoint(Math.round(fromBroker*100)/100,false,true);
                    useReserve.addPoint(Math.round(fromReserve*100)/100,false,true);
                  } else {
                    useSystem.addPoint(0);
                    useBroker.addPoint(0);
                    useReserve.addPoint(Math.round((currProd-((currProd-currCons)*reserveRate)-toBroker)*100)/100,false,true);
                  }
                  self.redraw();
                });
              }
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                color: '#000000'
              }
            },
            series: {
              pointWidth: 33,
              borderColor: '#333333',
              shadow: true
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
              text: 'Energy Usage (mW-h)'
            }
          },
          series: [{
            name:'Usage From System',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            // color: '#f2d007'
          },
          {
            name:'Usage From Broker',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#ff5500'
          },
          {
            name:'Usage From Reserve',
            data: (function () {
              var data = [];
              for (var i = -9; i <= 0; i += 1) {
                data.push(0);
              }
              return data;
            }()),
            color: '#f2d007'
          }]
        }
  
        var usageChart = new Highcharts.Chart(options);
      }
    };
  }])
