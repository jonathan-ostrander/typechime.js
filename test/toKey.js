/*jslint node: true */
"use strict";

var toKey = require('../app/toKey');
var assert = require('assert');

describe('toKey', function() {
  it('returns the correct key given a certain postive and negative score', function() {
    assert.equal(toKey({ positive: 0.67, negative: 0.1 }), 'Dmaj');
    assert.equal(toKey({ positive: 0.2, negative: 0.6667 }), 'Fmin');
    assert.equal(toKey({ positive: 0.111, negative: 0.111 }), 'Cmaj');
    assert.equal(toKey({ positive: 0.334, negative: 0.45 }), 'F#maj');
    assert.equal(toKey({ positive: 0.334, negative: 0.32 }), 'Fmaj');
    assert.equal(toKey({ positive: 0.1, negative: 0.36 }), 'Bmin');
  });

  it('throws an error if positive and negative are not given in the argument object', function() {
    assert.throws(function() { return toKey({ postive: 1 }); });
  });
});
