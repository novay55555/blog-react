const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');

gulp.task('default', ['prettify'], () => {});

gulp.task('prettify', ['jsprettify', 'cssprettify'], () => {});

gulp.task('jsprettify', () =>
  gulp.src('./src/**/**/*.js')
    .pipe(prettify({
      'indent_size': 2,
      'e4x': true,
      'brace_style': ',preserve-inline'
    }))
    .pipe(gulp.dest(file => file.base))
);

gulp.task('cssprettify', () =>
  gulp.src('./src/**/**/*.css')
    .pipe(prettify({
      'indent_size': 2
    }))
    .pipe(gulp.dest(file => file.base))
);
