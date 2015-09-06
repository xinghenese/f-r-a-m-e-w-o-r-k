'use strict';
var gulp = require('gulp');
var isDevelop = process.env.NODE_ENV === 'development';
var isProduct = process.env.NODE_ENV === 'production';

gulp.task('publish', ['build'], function () {
    return gulp.src('./dist/main.js')
        .pipe(require('gulp-uglify')())
        .pipe(gulp.dest('./dist'))
});

gulp.task('clean', function (done) {
    require('del')(['dist', 'chaoxin-*'], done);
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
    bundler.add(require('glob')('main/stores/*.js', {sync: true}));

    return function () {
        return bundler.bundle()
            .pipe(require('gulp-plumber')(function (err) {
                console.error(err);
                this.emit('end');
            }))
            .pipe(require('vinyl-source-stream')('main.js'))
            .pipe(gulp.dest('./dist'));
    };
}

gulp.task('build', ['clean'], bundlePayload(require('browserify')(browserifyOptions)));

gulp.task('watch', ['clean'], function () {
    var moment = require('moment');
    var watchify = require('watchify');
    var browserify = require('browserify');
    var bundler = watchify(browserify(browserifyOptions))
        .on('error', function (err) {
            console.error('err while watching');
            console.error(err);
            this.emit('end');
        })
        .on('update', function () {
            var label = moment().format('YYYY-MM-DD hh:mm:ss') + ' - Updated';
            console.time(label);
            bundle();
            console.timeEnd(label);
            require('gulp-connect').reload();
        });
    var bundle = bundlePayload(bundler);
    return bundle();
});
// endregion

// region tests
gulp.task('tests', function (done) {
    var path = require('path');
    var jest = require('jest-cli');
    // see http://facebook.github.io/jest/docs/api.html#config-options
    var options = {};
    jest.runCLI(options, path.join(__dirname, 'js'), done);
});

gulp.task('tests:tdd', function () {
    gulp.watch('./js/**/*.js', ['tests']);
});
// endregion

// region desktop
gulp.task('desktop:build', ['build'], function () {
    require('electron-packager')({
        dir: '.',
        name: 'chaoxin',
        asar: true,
        arch: 'x64',
        icon: 'images/logomac.icns',
        version: '0.31.1',
        platform: ['darwin', 'win32'],
        overwrite: true,
        ignore: [
            'node_modules/.DS_Store',
            'node_modules/.bin',
            'node_modules/asar',
            'node_modules/bower-resolve',
            'node_modules/browserify*',
            'node_modules/cssify',
            'node_modules/debowerify',
            'node_modules/del',
            'node_modules/electron*',
            'node_modules/glob',
            'node_modules/gulp*',
            'node_modules/jest*',
            'node_modules/jsbn',
            'node_modules/jscs',
            'node_modules/moment',
            'node_modules/node-notifier',
            'node_modules/npm',
            'node_modules/react-tools',
            'node_modules/reactify',
            'node_modules/run-sequence',
            'node_modules/tray',
            'node_modules/vinyl-source-stream',
            'node_modules/watchify',
            'chaoxin-*'
        ]
    }, function (err, appPath) {
        if (err) console.error(err);
        console.info('done.\nthe package is located in: ', appPath);
    });
});
// endregion

gulp.task('local-serve', ['watch'], function () {
    require('gulp-connect').server({
        root: '.',
        port: 8000,
        host: '0.0.0.0',
        livereload: true
    });
});

gulp.task('default', ['build']);
