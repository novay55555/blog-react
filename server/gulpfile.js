const gulp = require('gulp');
const mocha = require('gulp-mocha');
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

gulp.task('api-test', () =>
  gulp.src('./qa/test-api.js', { read: false })
  .pipe(mocha({
    ui: 'tdd',
    timeout: 5000,
    require: ['mocha-clean']
  }))
);