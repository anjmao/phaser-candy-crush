var gulp = require('gulp'),
   nodemon = require('gulp-nodemon'),
   ts = require('gulp-typescript'),
   sourcemaps = require('gulp-sourcemaps'),
   browserify = require('gulp-browserify');

var config = require('./config');

gulp.task('compile-server', function () {

   var tsResult = gulp.src(config.tsServerSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(config.tsCompiler));

   return tsResult.js
   //.pipe(concat('output.js'))
      //.pipe(sourcemaps.write())
      .pipe(gulp.dest(config.destServer));
});

gulp.task('compile-public', function () {
  
  var tsResult = gulp.src(config.tsPublicSrc)
      .pipe(sourcemaps.init())
      .pipe(ts(config.tsCompiler));

   return tsResult.js
   //.pipe(concat('output.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.destPublic));
});

gulp.task('watch-server', function () {
   gulp.watch(config.tsServerSrc, ['compile-server']);
});

gulp.task('watch-public', function () {
   gulp.watch(config.tsPublicSrc, ['compile-public']);
});

gulp.task('start',['compile-server','compile-public','watch-server','watch-public'],
   function () {
      nodemon({
         script: config.mainFile,
         ext: 'js',
      }).on('restart', function () {
         console.log('reload');
      });
   });


gulp.task('deploy', ['build'], function () {
   return gulp.src(['package.json'])
      .pipe(gulp.dest('./deploy'));
});

//gulp.task('default', ['deploy']);