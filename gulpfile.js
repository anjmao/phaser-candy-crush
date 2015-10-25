var gulp = require('gulp'),
   ts = require('gulp-typescript'),
   sourcemaps = require('gulp-sourcemaps'),
   clean = require('gulp-clean'),
   changed = require('gulp-changed'),
   concat = require('gulp-concat');

var config = require('./gulp.config');
var tsProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   module: 'commonjs'
});

var tsPublicProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   target: 'ES5'
});

var tsPublicGameProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   target: 'ES5'
});

var tsGameTestsProject = ts.createProject({
   declarationFiles: false,
   noExternalResolve: false,
   target: 'ES5'
});

//main task for dev
gulp.task('start', ['browser-sync', 'watch-game']);

//main task for deploy to heroku
gulp.task('heroku-build', ['clean-deploy', 'copy-package', 'compile-all'], postBuild);


gulp.task('browser-sync', ['start-server'], browserSyncTask);
gulp.task('start-server', ['compile-all'], startServer);

gulp.task('compile-all', ['compile-server', 'compile-public', 'compile-game']);
gulp.task('compile-server', compileServer);
gulp.task('compile-public', compilePublic);
gulp.task('compile-game', compileGame);

gulp.task('watch-all', ['watch-server', 'watch-public', 'watch-game']);
gulp.task('watch-server', ['compile-server'], watchServer);
gulp.task('watch-public', ['compile-public'], watchPublic);
gulp.task('watch-game', ['compile-game'], watchGame);
gulp.task('watch-game-tests', watchGameTests);

gulp.task('clean-deploy', cleanDeploy);
gulp.task('clean-js', cleanJs);
gulp.task('copy-package', copyPackage);


var browserSync = null;
function browserSyncTask(params) {
   browserSync = require('browser-sync').create();
   browserSync.init(null, {
      proxy: "http://localhost:3000",
      files: config.browserSync,
      browser: "google chrome",
      port: 7000,
   });
}

function compileServer(params) {
   return gulp.src(config.tsServerSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(config.tsCompiler)).js
      .pipe(gulp.dest(config.destServer));
}

function compilePublic(params) {
   var tsResult = gulp.src(config.tsPublicSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(tsPublicProject));

   return tsResult.js
      .pipe(concat('public.js'))
      .pipe(sourcemaps.write('../source-maps'))
      .pipe(gulp.dest(config.destPublic + 'app'));
}

function compileGame(params) {
   var tsResult = gulp.src(config.tsGameSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(tsPublicGameProject));

   return tsResult.js
      .pipe(concat('game.js'))
      .pipe(sourcemaps.write('../source-maps'))
      .pipe(gulp.dest(config.destPublic + 'app/game/'));
}

function watchGameTests() {
   var compileTests = function () {
      var tsResult = gulp.src(config.gameTestsSrc)
         .pipe(sourcemaps.init())
         .pipe(ts(tsGameTestsProject));

      return tsResult.js
         .pipe(concat('game-tests.js'))
         .pipe(sourcemaps.write('../tests-source-maps'))
         .pipe(gulp.dest(config.clientApp + 'game/tests'));
   }
   gulp.watch(config.gameTestsSrc, compileTests).on('change', function(){ log('changed...') });
}

function watchServer(params) {
   gulp.watch(config.tsServerSrc, ['compile-server']);
}


function watchPublic(params) {
   gulp.watch(config.tsPublicSrc, ['compile-public']);
}

function watchGame(params) {
   gulp.watch(config.tsGameSrc, ['compile-game']).on('change', function () {
      setTimeout(function () {
         browserSync.reload()
      }, 500)
   });
}

function startServer(cb) {

   var started = false;
   var nodemon = require('gulp-nodemon');

   return nodemon({
      script: config.mainFile,
      ignore: ["src/public/*.*"],
      ext: 'js',
   }).on('restart', function () {

   }).on('start', function () {
      if (!started) {
         cb();
         started = true;
      }
   });

}

function copyPackage(params) {
   return gulp.src(['package.json', 'Procfile']).pipe(gulp.dest('./deploy'));
}

function cleanDeploy() {
   return gulp.src('./deploy', { read: false })
      .pipe(clean());
}

function postBuild(params) {
   var files = [
      './src/**/*.js',
      './src/**/*.json',
      './src/**/*.png',
      './src/**/*.css',
      './src/**/*.vash',
      './src/**/*.wav',
      './src/**/*.mp3'
   ];

   return gulp.src(files)
      .pipe(gulp.dest('./deploy'));
}


function cleanJs(params) {
   var paths = [
      config.srcServer + '**/*.js',
      '!' + config.srcServer + 'public/libs/**/*.js'
   ]
   return gulp.src(paths, { read: false })
      .pipe(clean());
}


function log(message, object) {
   if(object){
      console.log(message, object);
   }
   else{
      console.log(message);
   }
   
}