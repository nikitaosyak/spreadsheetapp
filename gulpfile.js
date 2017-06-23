const gulp = require('gulp')
const shell = require('gulp-shell')
const jshint = require('gulp-jshint')

gulp.task('lint', () => {
    return gulp.src('./src/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish', {beep: true}))
        .pipe(jshint.reporter('fail'))
})

gulp.task('deploy', ['lint'], shell.task('gapps upload'))

gulp.task('watch', () => {
    gulp.watch(['src/**/*'], ['deploy'])
})

gulp.task('default', ['deploy', 'watch'])