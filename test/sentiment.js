/*jslint node: true */
"use strict";

var sentiment = require('../app/sentiment');
var assert = require('assert');

describe('sentiment', function() {
  it('returns the positive and negative scores of an input word', function() {
    assert.equal(sentiment('fawn').pos, 0.125);
    assert.equal(sentiment('unattackable').neg, 0.0);
  });

  it('returns the number of arguments that have non-zero scores', function() {
    assert.equal(sentiment('fawn', 'unattackable', 'to', 'the', 5, {}).size, 2);
  });

  it('returns scores of 0 and a size of 0 if there no valid arguments', function() {
    assert.deepEqual(sentiment({}, [], 'bubble butts', 42), { pos: 0, neg: 0, size: 0 });
  });
});
