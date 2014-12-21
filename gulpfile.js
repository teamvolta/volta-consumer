var gulp = require('gulp');
var mocha = require('gulp-mocha');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
   gulp.start('install', 'style');  // default task can be added here
});

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
  gulp.src('./{,*/}*.js')
    .pipe(concat('combined.js'))
    .pipe(concat.header('// file: <%= file.path %>\n'))
    .pipe(concat.footer('\n// end\n'))
    .pipe(gulp.dest('./dist')); //this creates a dist folder for the concatinated files
});

gulp.task('uglify', function () {
  gulp.src('dist/combined.js')  //take the result of concatenation
    .pipe(uglify())
    .pipe(gulp.dest('dist/combined.min.js')); //put the minified file to the same folder
});

/////////////
//Main tasks
/////////////

gulp.task('test', ['mochaTest', 'style']);






gulp.task('deploy', function () {
  
});

//Development: lint, (test), serve up locally

// Push Only after circle CI

// Add buttons, shortly deploy 

// deploy: assemble everything, push Azure