process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['client'];
var express = require('express');
var app = express();
var path = require('path');

// Setup middleware
var clientPath = path.resolve(__dirname, '../client');
var nodeModulePath = path.resolve(__dirname, '../node_modules');
console.log(clientPath);
console.log(nodeModulePath);
app.use(express.static(clientPath));
app.use(express.static(nodeModulePath));

app.get('/*', function (req, res){
  res.sendFile(clientPath + '/index.html');
});

// Serve admin
app.get('/admin', function (req, res){
  res.sendFile(clientPath + '/public/admin.html');
});

// Serve stats
// app.get('/api/stats', function (req, res){
//   res.json(reporter.update());
// });

app.listen(config.port);
console.log('client server listening on port ' + config.port);

