process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config')[process.env.NODE_ENV]['client'];
var express = require('express');
var app = express();
var path = require('path');

// Setup middleware
var clientPath = path.resolve(__dirname, '../client');
var nodeModulePath = path.resolve(__dirname, '../node_modules');
var bowerPath = path.resolve(__dirname, '../bower_components');

app.use(express.static(clientPath));
app.use(express.static(bowerPath));
app.use(express.static(nodeModulePath));

app.get('/*', function (req, res){
  res.sendFile(clientPath + '/index.html');
});

app.listen(config.port);
console.log('client server listening on port ' + config.port);

