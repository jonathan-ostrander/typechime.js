/*jslint node: true */
"use strict";

var toKey = require('../app/toKey');
var assert = require('assert');

describe('toKey', function() {
  it('returns the correct key given a certain postive and negative score', function() {
    assert.deepEqual(toKey({ pos:  0.67, neg:    0.1 }), ['D4', 'major']);
    assert.deepEqual(toKey({ pos:   0.2, neg: 0.6667 }), ['F4', 'minor']);
    assert.deepEqual(toKey({ pos: 0.111, neg:  0.111 }), ['C4', 'major']);
    assert.deepEqual(toKey({ pos: 0.334, neg:   0.45 }), ['F#4', 'major']);
    assert.deepEqual(toKey({ pos: 0.334, neg:   0.32 }), ['F4', 'major']);
    assert.deepEqual(toKey({ pos:   0.1, neg:   0.36 }), ['B4', 'minor']);
  });

  it('throws an error if positive and negative are not given in the argument object', function() {
    assert.throws(function() { return toKey({ postive: 1 }); });
  });
});
