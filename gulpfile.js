'use strict';

var gulp = require('gulp');

gulp.task('publish', ['build']);

gulp.task('clean', function (callback) {
    var del = require('del');
    del(['dist'], callback);
});

// region bundle
(function () {
    var isDev = process.env.NODE_ENV === 'development';
    var browserify = require('browserify');
    var options = {
        entries: ['./main.js'],
        basedir: './js/',
        transform: [require('reactify')],
        debug: isDev,
        cache: {},
        packageCache: {},
        fullPaths: isDev
    };

    function payload(bundler) {
        var glob = require('glob');
        var source = require('vinyl-source-stream');
        var plumber = require('gulp-plumber');

        bundler.require(glob('./js/main/stores/*.js', {sync: true}), {basedir: './'});

        return function () {
            return bundler.bundle()
                .pipe(plumber(function (err) {
                    console.error(err);
                    this.emit('end');
                }))
                .pipe(source('main.js'))
                .pipe(gulp.dest('./dist'));
        };
    }

    gulp.task('build', ['clean'], payload(browserify(options)));

    gulp.task('watch', ['clean'], function () {
        var moment = require('moment');
        var source = require('vinyl-source-stream');
        var watchify = require('watchify');
        var bundler = watchify(browserify(options))
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
        var bundle = payload(bundler);
        return bundle();
    });
}());
// endregion

// region tests
gulp.task('tests', function (done) {
    var jest = require('jest-cli');
    // see http://facebook.github.io/jest/docs/api.html#config-options
    var options = {};
    jest.runCLI(options, __dirname, done);
});

gulp.task('tests:tdd', function () {
    gulp.watch(['./**/*.js'], ['test']);
});
// endregion

gulp.task('local-serve', ['clean'], function () {
    return gulp.src('.')
        .pipe(require('gulp-webserver')());
});

gulp.task('default', ['build']);
