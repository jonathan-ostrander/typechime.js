var soundfontUrl = "/soundfont/";
var instruments = [ "acoustic_grand_piano" ];

// Bjorklund rhythm generation
function bjorklund(steps, pulses) {

  steps = Math.round(steps);
  pulses = Math.round(pulses);

  if (pulses > steps || pulses === 0 || steps === 0) {
    return [];
  }

  var pattern = [],
      counts = [],
      remainders = [],
      divisor = steps - pulses;
  remainders.push(pulses);
  level = 0;

  while(true) {
    counts.push(Math.floor(divisor / remainders[level]));
    remainders.push(divisor % remainders[level]);
    divisor = remainders[level];
    level += 1;
    if (remainders[level] <= 1) {
      break;
    }
  }

  counts.push(divisor);

  var r = 0;
  var build = function(level) {
    r++;
    if (level > -1) {
      for (var i=0; i < counts[level]; i++) {
        build(level-1);
      }
      if (remainders[level] !== 0) {
        build(level-2);
      }
    } else if (level == -1) {
      pattern.push(0);
    } else if (level == -2) {
      pattern.push(1);
    }
  };

  build(level);
  return pattern.reverse();
}

function sharpToFlat (note) {
  var base;
  if (note.charAt(0) === 'G') {
    base = 'A';
  } else {
    base = String.fromCharCode(note.charCodeAt(0) + 1);
  }
  return base === 'F' ? base + note.charAt(2) : base + 'b' + note.charAt(2);
}

var midiController = function() {
  this.midi = MIDI;
};

midiController.prototype = {
  init: function(options) {
    options = options || {};

    this.notesPlayed = 0;
    this.lastNote = new Date().getTime();
    this.scale = teoria.scale.apply(null, ['C4', 'major']);
    this.tempo = 300;
    this.sentiment = [];
    this.input = $('textarea');
    this.text = [];
    this.rhythm = bjorklund(1000 + Math.floor(Math.random()*100),
                            300 + Math.floor(Math.random()*100));
    this.chordProg = {
      '1,maj5': '5,maj5',
      '5,maj5': '4,min7',
      '4,min7': '3,min7',
      '3,min7': '4,maj5',
      '4,maj5': '1,maj7',
      '1,maj7': '4,maj7',
      '4,maj7': '5,maj7',
      '5,maj7': '1,maj5'
    };

    this.chord = [1, 'maj5'];

    options.soundfontUrl = options.soundfontUrl || soundfontUrl;
    options.instruments = options.instruments || instruments;
    options.callback = options.callback || function() {
      this.midi.programChange(0, 0);
      this.midi.programChange(1, 0);
    }.bind(this);
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
    if (this.rhythm[this.notesPlayed]) {
      this.playChord(delay);
    }
    this.midi.noteOn(0, note, 150, delay);
    this.notesPlayed += 1;
  },

  playChord: function(delay) {
    var chord = this.scale.get(this.chord[0])
                          .chord(this.chord[1])
                          .notes()
                          .map(function (note) {
                            note = note.toString();
                            note = note.substr(0,1).toUpperCase() + note.substr(1,2);
                            if (note.charAt(1) === '#') { note = sharpToFlat(note); }
                            return this.midi.keyToNote[note];
                          }.bind(this));
    console.log(chord);
    this.midi.chordOn(0, chord, 120, delay);
    this.changeChord();
  },

  changeChord: function() {
    var chordString = this.chord.join(',');
    this.chord = this.chordProg[chordString].split(',');
  },

  updateTempo: function(wpm) {
    this.tempo = wpm*10;
  }
};

$(function() {
  var words = [];
  var midi = new midiController();
  var wpm;
  var temp;
  var lastTime = new Date().getTime();
  var timeDiff = 0;
  midi.init();

  midi.input.on('input', function(e) {
    if ($('h2')) { $('h2').remove(); }
    var newInput = midi.input.val().split(/\s+/);
    if (newInput.slice(-1)[0] === "") {
      words = newInput.slice(midi.text.length - (newInput.length + 1), -1).map(function(d) {
        return d.replace(/[^\w\s']|_/g, "");
      });

      if (words.length > 0) {
        midi.postWords(words);
        midi.text = newInput;

        temp = new Date().getTime();
        timeDiff = temp - lastTime;
        lastTime = temp;
        wpm = 6e4 * words.length / (timeDiff);
        midi.updateTempo(wpm);
        console.log(midi.scale.name, midi.scale.simple());
      }
    } else if (midi.text.length + 1 < newInput.length) {
      words = newInput.slice(midi.text.length - newInput.length, -1).map(function(d) {
        return d.replace(/[^\w\s']_/g, "");
      });
      midi.postWords(words);
      midi.text = newInput;
    }
  });
});
