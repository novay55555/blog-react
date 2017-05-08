const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');

gulp.task('default', ['prettify'], () => {});

gulp.task('prettify', () => 
  gulp.src(['./src/**/**/*.js'])
    .pipe(prettify({
      'indent_size': 2,
      'e4x': true,
      'brace_style': ',preserve-inline'
    }))
    .pipe(gulp.dest(file => file.base))
);