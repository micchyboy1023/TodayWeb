var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    connect = require('gulp-connect'),
    del = require('del');

gulp.task('clean', function(callback) {
  return del(['./css'], callback);
});

gulp.task('site-sass', function() {
  return gulp.src('./assets/scss/main.scss')
             .pipe(sourcemaps.init())
             .pipe(plumber())
             .pipe(sass())
             .pipe(rename('style.css'))
             .pipe(sourcemaps.write('./maps'))
             .pipe(gulp.dest('./css'));
});

gulp.task('vendor-sass', function() {
  return gulp.src('./node_modules/bootstrap/scss/bootstrap.scss')
             .pipe(sourcemaps.init())
             .pipe(plumber())
             .pipe(sass())
             .pipe(concat('vendor.css'))
             .pipe(sourcemaps.write('./maps'))
             .pipe(gulp.dest('./css'));
});

gulp.task('css-autoprefixer', function() {
  return gulp.src('./css/*.css')
             .pipe(plumber())
             .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
             .pipe(gulp.dest('./css'));
});

gulp.task('sass', function(callback) {
  runSequence(['site-sass', 'vendor-sass'], 'css-autoprefixer', callback);
});

gulp.task('watch', function() {
  return gulp.watch('./assets/scss/**/*.scss', ['sass']);
  return gulp.watch('./assets/js/**/*.js', ['js']);
});

gulp.task('build', function(callback) {
  runSequence('clean', 'sass', callback);
});

gulp.task('serve', ['build', 'watch'], function() {
  return connect.server({
    root: './',
    livereload: true,
    https: false
  });
});

gulp.task('default', ['serve']);
