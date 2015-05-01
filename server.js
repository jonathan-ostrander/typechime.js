/*jslint node: true */
"use strict";

// set up
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Routes
require('./app/routes.js')(app);

// listen
app.listen(port);
console.log("App listening on port " + port);
