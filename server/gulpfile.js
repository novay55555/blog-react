const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');

gulp.task('default', ['prettify'], () => {});

gulp.task('prettify', ['jsprettify'], () => {});

gulp.task('jsprettify', () =>
  gulp.src(['./**/*.js', '!./node_modules/**'])
  .pipe(prettify({
    'indent_size': 2,
    'brace_style': ',preserve-inline'
  }))
  .pipe(gulp.dest(file => file.base))
);