/*jslint node: true */
"use strict";

// set up
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// routes
require('./app/routes.js')(app);

// listen
app.listen(app.get('port'), function() {
  console.log('App listening on port', app.get('port'));
});

module.exports = app;
