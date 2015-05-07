/*jslint node: true*/
"use strict";

var sentiment = require('./sentiment');
var toKey = require('./toKey');
var toNotes = require('./toNotes');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home', { title: 'typechime' });
  });

  app.get('/about', function(req, res) {
    res.render('about', { title: 'typechime: about' });
  });

  // API route that returns the notes for the given words, updated sentiment values, and the music key
  app.get('/words', function(req, res) {
    var _average = function(sentiments) {
      if (sentiments.length === 0) {
        return {
          pos: 0,
          neg: 0
        };
      }
      return sentiments.reduce(function (prev, cur, i) {
        return {
          pos: ( prev.pos * i + cur.pos ) / ( i + 1 ),
          neg: ( prev.neg * i + cur.neg ) / ( i + 1 )
        };
      });
    };

    var movingAverage = req.query.average ? req.query.average : 5;

    var data = {
      notes: req.query.words.map(toNotes)
    };

    data.sentiment = req.query.sentiment ?
                      req.query.sentiment.concat(sentiment(req.query.words)).slice(-1 * movingAverage) :
                      sentiment(req.query.words).slice(-1 * movingAverage);

    data.key = toKey(_average(data.sentiment));

    return res.json(data);
  });

};
