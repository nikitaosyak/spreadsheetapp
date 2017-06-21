const gulp = require('gulp')
const shell = require('gulp-shell')

gulp.task('deploy', shell.task('gapps upload'))

gulp.task('watch', () => {
    gulp.watch(['src/**/*'], ['deploy'])
})

gulp.task('default', ['deploy', 'watch'])