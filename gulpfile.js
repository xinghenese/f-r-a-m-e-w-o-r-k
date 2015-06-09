'use strict';

var gulp = require('gulp');
var gReact = require('gulp-react');
var reactify = require('reactify');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var runSequence = require('run-sequence');

var browserifyConfig = {
    entries: ['./app/main.js'],
    basedir: './js/main/'
};

gulp.task('clean', function(cb) {
    del(['lib', 'dist'], cb);
});

gulp.task('lib', function() {
    return gulp.src('js/**/*.js')
               .pipe(gReact({harmony: true}))
               .pipe(gulp.dest('lib'));
});

gulp.task('browserify', ['lib'], function() {
    return browserify(browserifyConfig)
            .bundle()
            .pipe(source('main.js'))
            .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'lib', 'browserify']);

gulp.task('publish', function(cb) {
    runSequence('clean', 'build', cb);
});

gulp.task('watch', function() {
    var bundler = browserify({
        entries: ['./app/demo.js'],
        basedir: './js/main/',
        transform: [reactify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    var watcher = watchify(bundler);
    return watcher.on('error', function(err){
        console.log('err while watching');
        console.log(err);
    }).on('update', function() {
        var updateStart = Date.now();
        console.log('Updating');
        watcher.bundle().pipe(source('main.js')).pipe(gulp.dest('./dist/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    }).bundle().pipe(source('main.js')).pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);
