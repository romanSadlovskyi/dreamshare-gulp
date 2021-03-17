const gulp = require('gulp');
const {series, parallel} = require('gulp');
const pug = require('gulp-pug');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');
 

const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(gulp.dest('build'));
};

const fonts = () => {
    gulp.src('src/styles/fonts/**/*.ttf')
        .pipe(ttf2woff())
        .pipe(gulp.dest('build/css/fonts'))
    return gulp.src('src/styles/fonts/**/*.ttf')
        .pipe(ttf2woff2())
        .pipe(gulp.dest('build/css/fonts'))
};

const styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('err', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( { suffix: '.min' }))
        .pipe(gulp.dest('build/css'));
};

const images = () => {
    return gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'));
};

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload);
};

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() })
};

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/images/*.*', images);
    gulp.watch('src/styles/fonts/**/*.ttf', fonts);
};

exports.default = series(
    deleteBuild,
    parallel(html, fonts, styles, images),
    parallel(watch, server)
);