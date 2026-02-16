const gulp = require('gulp');
const rename = require("gulp-rename");
const cht = require('gulp-cht');
const replace = require('gulp-replace');

gulp.task('localization', () => {
    // gulp.src('./index.html')
    // .pipe(cht())
    // .pipe(rename("zh-HK.html"))
    // .pipe(gulp.dest("./"));

    return gulp.src([
        'dist/relationship.min.js',
        'dist/relationship.min.mjs',
        'dist/relationship-mode.min.js',
        'dist/relationship-mode.min.mjs',
    ]).pipe(cht())
    .pipe(replace('嶽','岳'))
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('.min','.zh-HK.min');
    }))
    .pipe(gulp.dest('dist/lang/'))
});

gulp.task('default', gulp.series(['localization']))