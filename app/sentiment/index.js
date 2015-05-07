var fs = require('fs');
var sentimentJson = __dirname + '/sentiment.json';
var sentimentObj = JSON.parse(fs.readFileSync(sentimentJson, 'utf8'));

module.exports = function(words) {
  return words.map(function(word) {
    return sentimentObj[word];
  }).filter(function(d) {
    return d;
  });
};
