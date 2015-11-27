var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('jsx', function () {
    browserify(['./src/app.js'])
        .transform('babelify', {presets: ["react"]})
        .bundle()
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*'], ['jsx']);
});

gulp.task('default', ['watch', 'jsx']);