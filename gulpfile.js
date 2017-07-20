'use strict';
// Require and load our packages
var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  jslint = require('gulp-jslint'),
  yuidoc = require('gulp-yuidoc'),
  jshint = require('gulp-jshint');

// Reference our app files for easy reference in out gulp tasks
var paths = {
  server: {
    specs: [ './test/lib/*.js' ],
    libs_specs_path: [ './test/lib/*.js' ]
  }
};
var paths2 = {
  server: {
    specs: [ './test/lib/*.js' ],
    libs_specs_path: [ './test/api/*.js' ]
  }
};

// The `default` task gets called when no task name is provided to Gulp
gulp.task('default', [ 'jslint', 'tests', 'docs' ], function(cb) {
  cb().pipe(process.exit());
});

gulp.task('test', function(cb) {
  gulp
    .src(`${__dirname}/index.js`)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      console.log(paths.server.libs_specs_path);
      gulp
        .src(paths.server.libs_specs_path)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', function() {
          console.log('this happened');
          process.exit();
        });
    });
});
gulp.task('testsuper', function(cb) {
  gulp
    .src('lib/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp
        .src(`${__dirname}/test/lib/client.js`)
        .pipe(mocha({ reporter: 'spec', timeout: 5000 }))
        .pipe(istanbul.writeReports())
        .on('end', function() {
          process.exit();
        });
    });
});
gulp.task('lint', function() {
  gulp.src([ 'lib/*/*.js' ]).pipe(jshint()).pipe(jshint.reporter('default'));
});
