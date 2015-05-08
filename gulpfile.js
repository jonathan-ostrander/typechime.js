var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var server = require('gulp-express');
var mocha = require('gulp-mocha');

gulp.task('vendor-js', function() {
  gulp.src([
    './public/lib/jquery/dist/jquery.js',
    './public/lib/blog-examples/js/base64-binary.js',
    './public/lib/midi/build/MIDI.js',
    './public/lib/teoria/dist/teoria.js'
  ]).pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('soundfont', function() {
  gulp.src(['./public/lib/midi-soundfonts-partial/FluidR3_GM/*-ogg.js',
            './public/lib/midi-soundfonts-partial/FluidR3_GM/*-mp3.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/soundfont'));
});

gulp.task('local-js', function() {
  gulp.src(['./public/js/**/*.js'])
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('build/js'));

  console.log('JS built!');
});

gulp.task('js', ['vendor-js', 'soundfont', 'local-js'] );

gulp.task('test', function() {
  gulp.src('./test/*.js')
    .pipe(mocha());
});

gulp.task('server', ['test'], function() {
  server.run();

  gulp.watch(['./public/js/app.js'], ['js', server.notify]);

  gulp.watch(['./app/**/*.js'], ['test', server.run]);
});

gulp.task('default', ['test', 'js', 'server']);
