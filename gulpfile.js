'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    KarmaServer = require('karma').Server;

require('./inject');

gulp.task('spec', function () {
    var options = {
        injectify: {
            condition: {
                'if-mobile': true,
                'is-mobile': true,
                'if-desktop': false,
                'is-desktop': false
            }
        }
    };

    var bundleStream = browserify('./spec/index.js', options)
        .transform(require('injectify'))
        .bundle();

    return bundleStream
        .pipe(source('spec.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('karma', ['spec'], function (done) {
    KarmaServer.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('watch', function () {
    gulp.watch(['spec/**'], ['karma']);
});

gulp.task('default', ['karma', 'watch']);