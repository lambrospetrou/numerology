import {Gulpclass, Task, SequenceTask} from 'gulpclass/Decorators';

let gulp = require('gulp');
let del = require('del');

let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let cssnano = require('gulp-cssnano');
let concat = require('gulp-concat');
let size = require('gulp-size');
let uglify = require('gulp-uglify');

import * as sourcemaps from 'gulp-sourcemaps';
import * as webpack from 'webpack';
let exec = require('child_process').exec;
let gutil = require('gulp-util');

const DIR = {
    src: './src',
    dist: './build'
};

const PATHS = {
    html: ['index.html'],
    scripts: ['scripts/**/*.js', 'scripts/**/*.tsx'],
    libs: ['libs/**/*.js'], // 3rd-party JS
    styles: ['styles/**/*.css', 'styles/**/*.scss'],
    extras: [
        'humans.txt', 'robots.txt', 'favicon.ico',
    ], // other static files to be copied to the dist/
};

/** SASS **/
const autoprefixerOptions = {
      browsers: [],
};
const sassOptions = {
    outputStyle: 'compressed',
    errLogToConsole: true,
};

function createPath(dir, pathArray) {
    return pathArray.map((path) => dir + path);
}

@Gulpclass()
export class Gulpfile {

    @Task()
    clean(cb: Function) {
        return del([DIR.dist + "/**"], cb);
    }

    @Task('sass')
    sass() {
        return gulp
            .src(PATHS.styles, { cwd: DIR.src })
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(concat('styles.min.css'))
            .pipe(cssnano())
            .pipe(size({ title: 'styles' }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(`${DIR.dist}/styles/`));
    }

    @Task('webpack')
    webpack(cb: Function) {
        /*exec('npm run webpack', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (stderr.trim() !== '') {
                cb(Promise.reject(stderr));
            } else {
                cb(err);
            }
        });*/
        //webpack(require('./webpack.config.js')).run(cb);
        return webpack(require('./webpack.config.js'), function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            // webpack does not exit with 0 so check errors manually
            if (stats.compilation.errors && stats.compilation.errors.length) {
                let errorMessage = stats.compilation.errors.reduce(function (resultMessage, nextError) {
                  resultMessage += nextError.toString();
                  return resultMessage;
                }, '');
                gutil.log('[webpack] Error ::', gutil.colors.red(errorMessage));
                process.exit(1);
            }
            gutil.log("[webpack]", stats.toString({
                colors: gutil.colors.supportsColor
            }));
            cb();
        });
    }

    @Task('copy')
    copy() {
        // Copy 3P libs
        gulp
            .src(PATHS.libs, { cwd: DIR.src })
            .pipe(gulp.dest(DIR.dist));

        // Copy html
        gulp
            .src(PATHS.html, { cwd: DIR.src })
            .pipe(gulp.dest(DIR.dist));

        // Copy extra files
        return gulp
            .src(PATHS.extras, { cwd: DIR.src })
            .pipe(gulp.dest(DIR.dist));
    }

    @SequenceTask('build')
    build() {
        return ['clean', 'copy', 'sass', 'webpack'];
    }

    @SequenceTask('default')
    default() {
        return ['build'];
    }

}