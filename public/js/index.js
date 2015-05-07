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
    this.tempo = 300;
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
    var options = {
      sentiment: this.sentiment,
      words: words
    };

    $.ajax({
      dataType: 'json',
      contentType: 'application/json',
      url: '/words',
      data: options,
      success: this.handleNotes.bind(this)
    });
  },

  handleNotes: function(ajaxData) {
    this.sentiment = ajaxData.sentiment;
    this.setScale(ajaxData.key);

    ajaxData.notes.forEach(function (notes) {
      notes.forEach(this.playNote.bind(this));
      this.delay();
    }.bind(this));
  },

  delay: function() {
    // get milleseconds/beat from bpm
    var msPerBeat = 6e4/this.tempo;

    var time = new Date().getTime();
    var diff = time - this.lastNote;

    // if last note already played, return delay for next beat
    // else return when next note will play plus a beat
    var delay = diff > 0 ? msPerBeat - (diff % msPerBeat) : (-1 * diff) + msPerBeat;

    // update this.lastNote;
    this.lastNote = time + delay;

    return delay/1000;
  },

  playNote: function(note) {
    var octave = note < 7 ? '4' : '5';
    note = this.scale.simple()[note % 7];

    // Capitalize first letter of note and not the flat or sharp
    note = note.substr(0,1).toUpperCase() + note.substr(1,1) + octave;
    // Convert note into midi value
    note = this.midi.keyToNote[note];
    var delay = this.delay();
    this.midi.noteOn(0, note, 150, this.delay());
  },

  updateTempo: function(wpm) {
    this.tempo = wpm*2;
  }
};

$(function() {
  var words = [];
  var midi = new midiController();
  midi.init();

  midi.input.on('input', function(e) {
    if ($('h2')) { $('h2').remove(); }
    var newInput = midi.input.val().split(/\s+/);
    if (newInput.slice(-1) === "") {
      words = newInput.slice(newInput.length - (midi.text.length + 2), -1).map(function(d) {
        return d.replace(/[^\w\s']|_/g, "");
      });
      console.log(words);
      midi.postWords(words);
      midi.text = newInput;
    } else if (midi.text.length + 1 < newInput.length) {
      words = newInput.slice(midi.text.length - newInput.length).map(function(d) {
        return d.replace(/[^\w\s']_/g, "");
      });
      console.log(words);
      midi.postWords(words);
      midi.text = newInput;
    }
  });
});
