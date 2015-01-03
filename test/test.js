// var expect = require('chai').expect;
// var stubs = require('./stubs.js').development;
// var testConfig = stubs.consumer;

// describe('test for tests', function(){ //mock test, to test gulp and deployment
//   it('tests should run', function(){
//     var a = 2;
//     expect(a).to.equal(2);
//   });
// });

// var makeSuite = function (name, tests) {
//   describe (name, function () {
//     console.log('befor express');
//     before(function() {
//       var express = require('express');
//       var app = express();
//       var server = require('http').Server(app);
//       server.listen(testConfig.port);
//       var io = require('socket.io')(server);
//       var productionNsp = io.of('/production');
//      } 
//       tests(productionNsp);

//   });
// };

// makeSuite('Producer functionality', function (productionNsp) {
//   productionNsp.on('connection', function (socket) {
//   console.log('afterserver listen');
//     it('should send current production', function () {
//       socket.on('production', function(data) {
//         expect(data.currentProduction).to.be.a('number');
//       });  
//     })
//   });
// });
