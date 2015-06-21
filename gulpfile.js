var gulp = require('gulp'),
   nodemon = require('gulp-nodemon'),
   ts = require('gulp-typescript'),
   sourcemaps = require('gulp-sourcemaps'),
   browserify = require('gulp-browserify'),
   clean = require('gulp-clean');

var config = require('./config');

gulp.task('compile-server', compileServer);
gulp.task('compile-public', compilePublic);
gulp.task('watch-server', watchServer);
gulp.task('watch-public', watchPublic);
gulp.task('start',['compile-server','compile-public'], start);
gulp.task('deploy', ['build'], deploy);
gulp.task('clean-js', cleanJs);

function compileServer(params) {
   var tsResult = gulp.src(config.tsServerSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(config.tsCompiler));

   return tsResult.js
   //.pipe(concat('output.js'))
      //.pipe(sourcemaps.write())
      .pipe(gulp.dest(config.destServer));
}

function compilePublic(params) {
   var tsResult = gulp.src(config.tsPublicSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(config.tsCompiler));

   return tsResult.js
   //.pipe(concat('output.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.destPublic));
}


function watchServer(params) {
   gulp.watch(config.tsServerSrc, ['compile-server']);
}


function watchPublic(params) {
   gulp.watch(config.tsPublicSrc, ['compile-public']);
}

function start(params) {
   nodemon({
         script: config.mainFile,
         ext: 'js',
      }).on('restart', function () {
         console.log('reload');
      }).on('start',function(){
         watchPublic();
         watchServer();
      });
}

function deploy(params) {
    return gulp.src(['package.json'])
      .pipe(gulp.dest('./deploy'));
}


function cleanJs(params) {
   var paths = [
      config.srcServer+'**/*.js',
      '!'+config.srcServer+'public/libs/**/*.js'
   ]
   return gulp.src(paths, {read: false})
        .pipe(clean());
}

//gulp.task('default', ['deploy']);