var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

var paths = {
  scripts: ['./js/dev/*.js', './js/vendor/*.js']
};

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('concentration.all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./js/prod'));
});

gulp.task('default', ['scripts']);

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

