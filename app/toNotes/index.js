var phoneme = require('phoneme');
var notes = {
  ER:  0, EH:  1, UH:  2,
  AE:  3, IH:  4, AH:  5,
  UW:  6, AO:  7, IY:  8,
  OW:  9, EY: 10, AA: 11,
  AY: 12, AW: 13, OY: 14
};

module.exports = function (word) {

  var vowels = phoneme.vowels(word);
  return vowels ? vowels.map(function(vowel) { return notes[vowel.slice(0, -1)]; }) : [];

};
