process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['client'];
var express = require('express');
var app = express();

// Setup middleware
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/*', function (req, res){
  res.sendFile(__dirname + '/client/index.html');
});

// Serve admin
app.get('/admin', function (req, res){
  res.sendFile(__dirname + '/client/public/admin.html');
});

// Serve stats
// app.get('/api/stats', function (req, res){
//   res.json(reporter.update());
// });

app.listen(config.port);
console.log('client server listening on port ' + config.port);

