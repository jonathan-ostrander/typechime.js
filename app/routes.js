/*jslint node: true*/
"use strict";

// expose the routes to our app with module.exports
module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home', { title: 'typechime' });
  });

  app.get('/about', function(req, res) {
    res.render('about', { title: 'typechime: about' });
  });

};
