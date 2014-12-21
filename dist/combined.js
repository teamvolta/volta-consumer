// file: /Users/anastasiazotova/hr/volta/volta-consumer/combined.js
exports.development = {
  systemIp: 'http://localhost:8000/consumers',
  consumerId: Math.random().toString(36).substr(2),
  minimumConsumption: 0,
  midConsumption: 50,
  maxConsumption: 100,
  bidDeviation: 20,
  consumptionDeviation: 5
};

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat-util');

gulp.task('default', function() {
   gulp.start('install', 'style');  // default task can be added here
});

gulp.task('install', function() {
   gulp.src('./package.json') //gulp.src fetches the file and passes it on as an argument
     .pipe(install());
})

//////////////
//Helper tasks
//////////////

gulp.task('mochaTest', function() {  //I am still not sure what it actually does
	                            // passing shared module in all tests (according to docs)
  return gulp.src('test/test.js', {read: false})   
           .pipe(mocha({reporter: 'spec'}));  //reporter spec is just the nested structure of Mocha output
});

gulp.task('style', function() {
  gulp.src('./*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('concat', function () {
  gulp.src('./{,*/}*.js')
    .pipe(concat('combined.js'))
    .pipe(concat.header('// file: <%= file.path %>\n'))
    .pipe(concat.footer('\n// end\n'))
    .pipe(gulp.dest('./dist')); //this creates a dist folder for the concatinated files
});

/////////////
//Main tasks
/////////////

gulp.task('test', ['mochaTest', 'style']);






gulp.task('deploy', function () {
  
});

//Development: lint, (test), serve up locally

// Push Only after circle CI

// Add buttons, shortly deploy 

// deploy: assemble everything, push Azure
var config = require('./config').development;
var consumerId = config.consumerId;
var socket = require('socket.io-client')(config.systemIp);
var simulation = require('./simulation');

console.log("Running the server file");

socket.on('connect', function() {
  consumerId = socket.io.engine.id;
});

// Receive time-slot and duration from system operator to send bids
// {
//   timeslot: UTC ms,
//   duration: ms
// }
socket.on('startBidding', function(data) {
  socket.emit('bid', {
    data: simulation.bid(data),
    consumerId: consumerId
  });
});

// System admin sends back the price for the time-slot
socket.on('receipt', function(receipt) {
 // Do something with price
 console.log(receipt);
});

// System admin keeps track of total consumption of all consumers
setInterval(function () {
  socket.emit('consume', {
    currentConsumption: simulation.currentConsumption(),
    consumerId: config.consumerId
  });
}, 100);

// Made as per http://www.hydroone.com/RegulatoryAffairs/RatesPrices/Pages/ElectricityPrices.aspx
var config = require('./config');
var bid = config.midConsumption;
var bidTime = Date();
var consumption = bid;

exports.bid = function (data) {
  var time = data.blockStart;  // UTC date
  return [{
      price: 10,
      energy: 10
  }];
  // time = UTC milliseconds, result of Date.now()
// Simulating demand according to the time of the day
  // if(time > '9' && time < '22'){
  //   if(time < '12' && time > '18') {
  //     bid = config.maxConsumption - (Math.random() * config.bidDeviation);
  //     return bid;
  //   } else {
  //     bid = config.midConsumption + (Math.random() * config.bidDeviation);
  //     return bid;
  //   }
  // } else {
  //   bid = config.midConsumption - (Math.random() * config.bidDeviation);
  //   return bid;
  // }
};

exports.currentConsumption = function() {
  if(Date() > bidTime) {
    consumption = bid;
  }
  return consumption;
}

module.exports = {

};
var expect = require('chai').expect;
var stubs = require('./stubs.js');

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

// end
