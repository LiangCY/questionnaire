var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

gulp.task('jsx', function () {
    browserify(['./public/app/src/app.js'])
        .transform('babelify', {presets: ["react"]})
        .bundle()
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./public/app/dist'));
});

gulp.task('watch', function () {
    gulp.watch(['public/app/src/**/*'], ['jsx']);
});

gulp.task('serve', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        ignore: ['public/**/*'],
        env: {'NODE_ENV': 'development'}
    })
});

gulp.task('default', ['watch', 'jsx', 'serve']);