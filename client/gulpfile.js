const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');

gulp.task('default', ['prettify'], () => {});

gulp.task('prettify', ['cssprettify'], () => {});

gulp.task('cssprettify', () =>
  gulp.src('./src/**/*.css')
    .pipe(prettify({
      'indent_size': 2
    }))
    .pipe(gulp.dest(file => file.base))
);
