/*jslint node: true*/
"use strict";

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home', { title: 'typechime' });
  });

  app.get('/about', function(req, res) {
    res.render('about', { title: 'typechime: about' });
  });

  app.get('/notes', function(req, res) {

  });

};
