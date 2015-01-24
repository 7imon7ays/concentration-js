var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

var paths = {
  scripts: [
            './js/dev/player.js',
            './js/dev/*.js',
            './js/vendor/*.js'
            ],
  styles: ['./css/dev/*.css']
};

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('concentration.all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./js/prod'));
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(concat('concentration.all.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css/prod'));
});

gulp.task('default', ['scripts', 'styles']);

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scripts, ['styles']);
});

