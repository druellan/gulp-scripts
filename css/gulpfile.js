// Main dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

// HTML dependencies
var fileinclude = require('gulp-file-include');

// CSS dependencies
var concatCSS = require('gulp-concat');
var minCSS = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');

// JS dependencies
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Dev Tools
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncConfig = false;
try {
	browserSyncConfig = require('./bs-config.js');
} catch(e){};


// Options for compilation/concatenation/parsing

var buildFolder = "./build";

var cssSettings = {
	src: "./css/style.css",
	dest: buildFolder+"/css",
	destfilename: "style.min.css",
	watch: "./css/**/*",
	config: { 
		keepBreaks: false, 
		keepSpecialComments: "*", 
		processImport: true,
		relativeTo: "./css",
		rebase: false }
};
var jsSettings = {
	src: "./js/**/*.js",
	dest: buildFolder+"/js",
	destfilename: "main.js",
	watch: "./js/**/*.js"
};
var htmlSettings = {
	src: "./html/*.html",
	dest: buildFolder+"/",
	watch: "./html/**/*"
};

// Default tasks

gulp.task('build', ['html', 'css', 'js']);
gulp.task('watch', ['html', 'css', 'js', 'watch-task']);
gulp.task('serve', ['html', 'css', 'js', 'browsersync', 'watch-task']);

gulp.task('default', function(){
	gutil.log("Use ", "[gulp build] to build the project.");
	gutil.log("Use ", "[gulp css] to compile the CSS [watcheable].");
	gutil.log("Use ", "[gulp js] to compile the JS functions [watcheable].");

	gutil.log("Use ", "[gulp html] to compile the HTML template [watcheable].");

	gutil.log("Use ", "[gulp serve] to build, watch and start the Browsersync server.");
});

// html

gulp.task('html', function() {
	gulp.src(htmlSettings.src)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(rename({prefix: 'frontdev.'}))
		.pipe(gulp.dest(htmlSettings.dest));
});

// css

gulp.task('css', function () {

	return gulp.src(cssSettings.src)
		.pipe(sourcemaps.init())
		.on("error", errorHandler)
		
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
        }))
		.on("error", errorHandler)

		.pipe(minCSS(cssSettings.config))
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(cssSettings.dest))
		.pipe(rename(cssSettings.destfilename))

		.pipe(browserSync.stream()); // TODO: recheck this is the current method for inplace refresh
});

// Js

gulp.task('js', function () {

	return gulp.src(jsSettings.src)
		.pipe(sourcemaps.init())

		.pipe(concat(jsSettings.destfilename))
		.on("error", errorHandler)

		.pipe(uglify())
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(jsSettings.dest))

		.pipe(browserSync.stream());
});

// SVG
gulp.task('svg', function() {
	return gulp.src(svgSettings.src)
		.pipe(svgSprite(svgSettings.config))
		.pipe(gulp.dest(svgSettings.dest));
});

// Watchers

gulp.task('watch-task', function () {

	gulp.watch(htmlSettings.watch, ['html']);
	gulp.watch(cssSettings.watch, ['css']);
	gulp.watch(jsSettings.watch, ['js']);

	gulp.watch(htmlSettings.dest+"*.html").on('change', browserSync.reload);

});


// Static server
// If you need some extra configuration, generate a BrowserSync config file
// Ex: browser-sync init

gulp.task('browsersync', function() {
	if ( !browserSyncConfig ) return browserSync();
	return browserSync(browserSyncConfig);
});

// Small, portable, cute error handler

var errorHandler = function(err) {

	gutil.log(err);
	gutil.beep();
	this.emit('end');
};
