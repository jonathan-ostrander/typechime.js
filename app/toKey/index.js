module.exports = function(scores) {
  var pos = scores.pos,
      neg = scores.neg;

  if ((typeof pos === 'undefined') || (typeof neg === 'undefined')) {
    throw Error('Postive and Negative must be specified.');
  }

  if ( pos >= 2/3 ) {
    return ['D4', 'major'];
  } else if ( neg >= 2/3 ) {
    return ['F4', 'minor'];
  } else if ( pos + neg <= 1/3 ) {
    return ['C4', 'major'];
  } else if ( pos >= 1/3 && neg >= 1/3 ) {
    return ['F#4', 'major'];
  } else if ( neg < 1/3 ) {
    return ['F4', 'major'];
  } else {
    return ['B4', 'minor'];
  }
}
