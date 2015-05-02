[typechi.me](http://typechi.me)
===============================

A clone of the python [typechime](https://github.com/OstrichProjects/typechime) using node.

Generating music based on typing speed, connotation, and vowel sounds.

Typechi.me was made at [HackRPI](http://hack.rpi.edu) by myself and Jon Schaad.  We were hoping to create something that produced music based on the words that were being typed.

It uses [MIDI.js](https://github.com/mudcube/MIDI.js/) to produce the play the music in the browser.

I am in the process of node-ifying it/improving the frontend code because it's a sloppy hackathon project and I feel like it has some potential.

To run a local instance of Typechi.me:

```bash
git clone git://github.com/OstrichProjects/typechime.js.git
npm install
node server.js
```

## For Developement

### Testing

All of the tests are in the [test directory](test/) implemented with mocha.  To test, run:

```bash
npm test
```
