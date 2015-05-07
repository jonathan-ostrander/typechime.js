var soundfontUrl = "/soundfont/";
var instruments = [ "acoustic_grand_piano" ];

var midiController = function() {
  this.midi = MIDI;
};

midiController.prototype = {
  init: function(options) {
    options = options || {};

    this.lastNote = new Date().getTime();
    this.scale = teoria.scale.apply(null, ['C4', 'major']);
    this.tempo = 120;
    this.sentiment = [];
    this.input = $('textarea');
    this.text = [];

    options.soundfontUrl = options.soundfontUrl || soundfontUrl;
    options.instruments = options.instruments || instruments;
    this.midi.loadPlugin(options);
  },

  addInstrument: function(instrument) {
    this.midi.loadPlugin({ instrument: instrument });
  },

  setScale: function(scale) {
    this.scale = teoria.scale.apply(null, scale);
  },

  postWords: function(words) {
    var _this = this;

    var _handleNotes = function(ajaxData) {
      _playNote = function(note) {
        var octave = note < 7 ? '4' : '5';
        note = _this.scale.simple()[note % 7];

        // Capitalize first letter of note and not the flat or sharp
        note = note.substr(0,1).toUpperCase() + note.substr(1,1) + octave;
        // Convert note into midi value
        note = _this.midi.keyToNote[note];
        var delay = _delay();
        _this.midi.noteOn(0, note, 150, _delay());
      };

      _delay = function() {
        // get milleseconds/beat from bpm
        var msPerBeat = 6e4/_this.tempo;

        var time = new Date().getTime();
        var diff = time - _this.lastNote;

        // if last note already played, return delay for next beat
        // else return when next note will play plus a beat
        var delay = diff > 0 ? msPerBeat - (diff % msPerBeat) : (-1 * diff) + msPerBeat;

        // update this.lastNote;
        _this.lastNote = time + delay;

        return delay/1000;
      };

      _this.sentiment = ajaxData.sentiment;
      _this.setScale(ajaxData.key);

      ajaxData.notes.forEach(function (notes) {
        notes.forEach(_playNote);
        _delay();
      });
    };

    var options = {
      sentiment: this.sentiment,
      words: words
    };

    $.ajax({
      dataType: 'json',
      contentType: 'application/json',
      url: '/words',
      data: options
    }).done(_handleNotes);
  },

  updateTempo: function(wpm) {
    this.tempo = wpm*2;
  }
};

$(function() {
  var midi = new midiController();
  midi.init();

  midi.input.on('input', { _this: midi }, function(e) {
    var newInput = e.data._this.input.val().split(/\s+/);
    if (e.data._this.text.length < newInput.length) {
      var diff = newInput.length - e.data._this.text.length;
      e.data._this.postWords(newInput.slice(-1 * diff));
      e.data._this.text = newInput;
    }
  });
});
