/*jslint node: true */
"use strict";

var toNotes = require('../app/toNotes');
var assert = require('assert');

describe('toNotes', function() {
  it('returns numbers relative to the base key corresponding to the vowel sounds in the word', function () {
    assert.deepEqual(toNotes('phonetic'), [ 5, 1, 4 ]);
  });

  it('returns [] for invalid words', function() {
    assert.deepEqual(toNotes('ihatepugs'), []);
  });
});
