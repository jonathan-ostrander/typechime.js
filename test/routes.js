var app = require('../app.js');
var port = '3333';
var request = require('request');
var assert = require('assert');

describe('#words', function () {

  before (function (done) {
    var server = app.listen(port, function (err, result) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('should return updated notes, sentiment, and key when supplied with words and sentiment', function(done) {
    var options = {
      method: 'get',
      host: 'localhost',
      port: port,
      path: '/words?words%5B%5D=fawn&words%5B%5D=unattackable&words%5B%5D=to&words%5B%5D=the'
    };

    request({
        url: 'http://localhost:3333/words?words%5B%5D=fawn&words%5B%5D=unattackable&words%5B%5D=to&words%5B%5D=the',
      }, function (error, res, body) {
        assert.equal(JSON.parse(body).key, 'Cmaj');
        done();
    })
  });

});
