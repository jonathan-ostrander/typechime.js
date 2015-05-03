/*jslint node: true */
"use strict";

var toKey = require('../app/toKey');
var assert = require('assert');

describe('toKey', function() {
  it('returns the correct key given a certain postive and negative score', function() {
    assert.equal(toKey({ pos:  0.67, neg:    0.1 }), 'Dmaj');
    assert.equal(toKey({ pos:   0.2, neg: 0.6667 }), 'Fmin');
    assert.equal(toKey({ pos: 0.111, neg:  0.111 }), 'Cmaj');
    assert.equal(toKey({ pos: 0.334, neg:   0.45 }), 'F#maj');
    assert.equal(toKey({ pos: 0.334, neg:   0.32 }), 'Fmaj');
    assert.equal(toKey({ pos:   0.1, neg:   0.36 }), 'Bmin');
  });

  it('throws an error if positive and negative are not given in the argument object', function() {
    assert.throws(function() { return toKey({ postive: 1 }); });
  });
});
