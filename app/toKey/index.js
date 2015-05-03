module.exports = function(scores) {
  var pos = scores.pos,
      neg = scores.neg;

  if ((typeof pos === 'undefined') || (typeof neg === 'undefined')) {
    throw Error('Postive and Negative must be specified.');
  }

  if ( pos >= 2/3 ) {
    return 'Dmaj';
  } else if ( neg >= 2/3 ) {
    return 'Fmin';
  } else if ( pos + neg <= 1/3 ) {
    return 'Cmaj';
  } else if ( pos >= 1/3 && neg >= 1/3 ) {
    return 'F#maj';
  } else if ( neg < 1/3 ) {
    return 'Fmaj';
  } else {
    return 'Bmin';
  }
}
