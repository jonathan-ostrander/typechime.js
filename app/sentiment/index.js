var fs = require('fs');
var sentimentJson = __dirname + '/sentiment.json'
var sentimentObj = JSON.parse(fs.readFileSync(sentimentJson, 'utf8'));

module.exports = function() {
  
  var _average = function(toAverage, newObj) {
    var pos = toAverage.pos * toAverage.size + newObj.pos;
    var neg = toAverage.neg * toAverage.size + newObj.neg;
    var size = toAverage.size + 1;

    return { pos: pos/size, neg: neg/size, size: size };
  }

  var words = [].slice.apply(arguments)

  var sentiments = { pos: 0, neg: 0, size: 0 };

  words.forEach(function(word) {
    if (sentimentObj[word]) {
      sentiments = _average(sentiments, sentimentObj[word]);
    }
  });

  return sentiments;
}
