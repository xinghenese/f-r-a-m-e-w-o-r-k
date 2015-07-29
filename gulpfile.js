'use strict';

var gulp = require('gulp');
var reactify = require('reactify');

var browserifyOptions = {
    entries: ['./main.js'],
    basedir: './js/',
    transform: [reactify],
    debug: process.env['NODE_ENV'] === 'development',
    cache: {},
    packageCache: {},
    fullPaths: true
};

gulp.task('clean', function (callback) {
    var del = require('del');
    del(['dist'], callback);
});

gulp.task('build', ['clean'], function () {
    var source = require('vinyl-source-stream');
    var glob = require('glob');
    var bundler = require('browserify')(browserifyOptions);
    var pattern = './js/main/stores/*.js';

    bundler.require(
        glob(pattern, {sync: true}),
        {basedir: './'}
    );

    return bundler.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('publish', ['build']);

gulp.task('watch', function () {
    var moment = require('moment');
    var source = require('vinyl-source-stream');
    var plumber = require('gulp-plumber');
    var bundler = require('browserify')(browserifyOptions);
    var glob = require('glob');
    var pattern = './js/main/stores/*.js';

    bundler.require(
        glob(pattern, {sync: true}),
        {basedir: './'}
    );

    function bundle() {
        return bundler.bundle()
            .pipe(plumber(function (err) {
                console.error(err);
                this.emit('end');
            }))
            .pipe(source('main.js'))
            .pipe(gulp.dest('./dist/'));
    }

    bundler = require('watchify')(bundler)
        .on('error', function (err) {
            console.error('err while watching');
            console.error(err);
        })
        .on('update', function () {
            var label = moment().format('YYYY-MM-DD hh:mm:ss') + ' - Updated';
            console.time(label);
            bundle();
            console.timeEnd(label);
        });

    return bundle();
});

gulp.task('local-serve', function () {
    return gulp.src('.')
        .pipe(require('gulp-webserver')());
});

gulp.task('default', ['build']);
