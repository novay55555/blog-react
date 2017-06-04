const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');
const pump = require('pump');

gulp.task('default', ['uglify', 'cleancss'], () => { });

gulp.task('format', ['cssprettify'], () => { });

gulp.task('cssprettify', () => {
  gulp.src('./src/**/*.css').pipe(prettify({'indent_size': 2})).pipe(gulp.dest(file => file.base));
});

gulp.task('uglify', () => {
  pump(
    [
      gulp.src(['./vendor/markdown-editor/*.js']),
      uglify(),
      gulp.dest(file => file.base)
    ], err => { if (err) console.log(`pipe interrupt by ${err}`); });
});

gulp.task('cleancss', () => {
  return gulp.src(['./vendor/animate.css', './vendor/highlightjs/monokai-sublime.css']).pipe(cleancss()).pipe(gulp.dest(file => file.base));
});
