var gulp = require('gulp');
var mocha = require('gulp-mocha');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var run = require('gulp-run');

gulp.task('default', ['mochaTest']); 

gulp.task('install', function() {
   gulp.src('./package.json') //gulp.src fetches the file and passes it on as an argument
     .pipe(install());
});

//////////////
//Helper tasks
//////////////

gulp.task('mochaTest', function() {  //I am still not sure what it actually does
	                            // passing shared module in all tests (according to docs)
  return gulp.src('test/test.js', {read: false})   
           .pipe(mocha({reporter: 'spec'}));  //reporter spec is just the nested structure of Mocha output
});

gulp.task('style', function() {
  gulp.src('./*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('concat', function () {
  return gulp.src('./{,*/}*.js') //need return here to hint that uglify should wait until the value is returned
    .pipe(concat('combined.js'))
    .pipe(concat.header('// file: <%= file.path %>\n'))
    .pipe(concat.footer('\n// end\n'))
    .pipe(gulp.dest('./dist')); //this creates a dist folder for the concatinated files
});

gulp.task('uglify', ['concat'], function () {   // ['concat'] means that we should run 'concat' first  
  gulp.src('dist/combined.js')  //take the result of concatenation
    .pipe(uglify())
    .pipe(gulp.dest('dist/combined.min.js')); //put the minified file to the same folder
});

gulp.task('minifyCSS', function () {
  // the content will be added when we have css. Instructions are here: https://www.npmjs.com/package/gulp-minify-css
});

gulp.task('upload', function () { 
  run('git push azure').exec(); //this runs the deployment command
});

/////////////
//Main tasks
/////////////

gulp.task('test', ['mochaTest', 'style']);

gulp.task('build', ['concat', 'uglify', 'minifyCSS']);



gulp.task('deploy', function () {
  
});

//Development: lint, (test), serve up locally

// Push Only after circle CI

// Add buttons, shortly deploy 

// deploy: assemble everything, push Azure