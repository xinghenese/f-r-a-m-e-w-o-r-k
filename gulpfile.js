'use strict';

var gulp = require('gulp');
var packager = require('electron-packager');
var isDev = process.env.NODE_ENV === 'development';
var isProduct = process.env.NODE_ENV === 'production';

gulp.task('publish', ['build']);

gulp.task('clean', function(done) {
    var del = require('del');
    del(['dist'], done);
});

// region bundle
var browserifyOptions = {
    entries: ['./main.js'],
    basedir: './js/',
    transform: [require('reactify'), require('cssify')],
    debug: !isProduct,
    cache: {},
    packageCache: {},
    fullPaths: !isProduct
};

function bundlePayload(bundler) {
    var glob = require('glob');
    var source = require('vinyl-source-stream');
    var plumber = require('gulp-plumber');

    bundler.add(glob('./js/main/stores/*.js', {sync: true}), {basedir: './'});

    return function() {
        return bundler.bundle()
            .pipe(plumber(function(err) {
                console.error(err);
                this.emit('end');
            }))
            .pipe(source('main.js'))
            .pipe(gulp.dest('./dist'));
    };
}

gulp.task('build', ['clean'], bundlePayload(require('browserify')(browserifyOptions)));

gulp.task('watch', ['clean'], function() {
    var moment = require('moment');
    var source = require('vinyl-source-stream');
    var watchify = require('watchify');
    var browserify = require('browserify');
    var bundler = watchify(browserify(browserifyOptions))
        .on('error', function(err) {
            console.error('err while watching');
            console.error(err);
            this.emit('end');
        })
        .on('update', function() {
            var label = moment().format('YYYY-MM-DD hh:mm:ss') + ' - Updated';
            console.time(label);
            bundle();
            console.timeEnd(label);
        });
    var bundle = bundlePayload(bundler);
    return bundle();
});
// endregion

// region tests
gulp.task('tests', function(done) {
    var path = require('path');
    var jest = require('jest-cli');
    // see http://facebook.github.io/jest/docs/api.html#config-options
    var options = {};
    jest.runCLI(options, path.join(__dirname, 'js'), done);
});

gulp.task('tests:tdd', function() {
    gulp.watch('./js/**/*.js', ['tests']);
});
// endregion

gulp.task('local-serve', ['watch'], function() {
    return gulp.src('.')
        .pipe(require('gulp-webserver')({
            livereload: true
        }));
});

gulp.task('package', ['build'], function() {
    packager({
        dir: ".",
        name: "chaoxin",
        platform: ["darwin", "win32"],
        arch: "x64",
        version: "0.31.0",
        icon: "images/logomac.icns",
        asar: true,
        overwrite: true,
        ignore: [
            "node_modules/asar",
            "node_modules/bower-resolve",
            "node_modules/electron*",
            "node_modules/gulp*",
            "node_modules/jest*",
            "node_modules/jscs",
            "node_modules/vinyl-source-stream",
            "node_modules/watchify",
            "chaoxin-*"
        ]
    }, function(err, appPath) {
        if (err) {
            console.error(err);
        } else {
            console.log("done.\nthe package is located in: ", appPath);
        }
    });
});

gulp.task('default', ['build']);
