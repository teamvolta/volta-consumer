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
            },
            type: 'datetime',
            tickInterval: 900000 //15 minutes
          },
          yAxis: {
            title: {
              text: 'Energy Usage and Production (KW)'
            },
            labels: {
              formatter: function() {
                return this.value + ' KW';
              }
            }
          },
          series: [{
            name:'Energy Usage',
            data: (function () {
              var data = [];
              if (Socket.storage.length) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].currentConsumption*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          },
          {
            name:'Solar Production',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].currentProduction*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#f2d007',/*'#ffff66'*/
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
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
            },
            type: 'datetime',
            tickInterval: 900000 //15 minutes
          },
          yAxis: {
            title: {
              text: 'USD ($)'
            }
          },
          series: [{
            name:'Market price per KW',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].systemPrice*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          },
          {
            name:'Brokerage purchase price per KW',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].brokerPrice*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#f6546a',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
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
            },
            type: 'datetime',
            tickInterval: 900000 //15 minutes
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
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].currentConsumption*Socket.storage[j].systemPrice*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#f75151',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          },
          {
            name:'Production Revenue',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].supplyBroker*Socket.storage[j].brokerPrice*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#7eca67',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
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
            },
            type: 'datetime',
            tickInterval: 900000 //15 minutes
          },
          yAxis: {
            title: {
              text: 'Solar Production (KW)'
            }
          },
          series: [{
            name:'Production Reserve',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round((Socket.storage[j].currentProduction-Socket.storage[j].supplyBroker)*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#f2d007',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          },
          {
            name:'Production Supply to Broker',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].supplyBroker*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#ff5500',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
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
                    self.redraw();

                  } else {
                    useSystem.addPoint(0, false, true);
                    useBroker.addPoint(0, false, true);
                    useReserve.addPoint(Math.round((currProd-((currProd-currCons)*reserveRate)-toBroker)*100)/100,false,true);
                    self.redraw();
                  }
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
            },
            type: 'datetime',
            tickInterval: 900000 //15 minutes
          },
          yAxis: {
            title: {
              text: 'Energy Usage (KW)'
            }
          },
          series: [{
            name:'Usage From System',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].allotedBySystem*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
            // color: '#f2d007'
          },
          {
            name:'Usage From Broker',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].allotedByBroker*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#ff5500',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          },
          {
            name:'Usage From Reserve',
            data: (function () {
              var data = [];
              if (Socket.storage.length >=9) {
                for (var j = 0; j < Socket.storage.length; j++) {
                  data.push(Math.round(Socket.storage[j].currentProduction*100)/100);
                }
              } else {
                for (var i = -9; i <= 0; i += 1) {
                  data.push(0);
                }
              }
              return data;
            }()),
            color: '#f2d007',
            pointStart: Date.UTC(2014, 0, 1, 5, 29), //start at 6:30am
            pointInterval: 720000 // 12 minutes
          }]
        }
  
        var usageChart = new Highcharts.Chart(options);
      }
    };
  }])
