const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    merge = require('merge2'),
    bump = require('gulp-bump');

const project = tsc.createProject('tsconfig.json');

gulp.task('typescript', () => {

    const out = gulp.src('src/*.ts')
        .pipe(project());

    return merge([
        out.dts.pipe(gulp.dest('lib')),
        out.js.pipe(gulp.dest('lib'))
    ]);
});

gulp.task('bump', () => {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('.'));
});

gulp.task('webpack', () => {
    return gulp.src('src/index.ts')
        .pipe(webpackStream(require('./webpack.config'), webpack))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['typescript', 'webpack']);