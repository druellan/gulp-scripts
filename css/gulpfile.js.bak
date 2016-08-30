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

var buildFolder = "./static";
var sourceFolder = "./src";
var productionBuild = gutil.env.production;

var autoprefixerConfig = {
	browsers: [ "last 4 versions", "ie >= 9", "> 5%" ],
	cascade: false
}

var mincssConfig = { 
	keepBreaks: !productionBuild, 
	keepSpecialComments: 1, 
	processImport: true,
	relativeTo: sourceFolder+"/css",
	rebase: false
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
	gutil.log("Use ", "[gulp --production] flag to minimize and further optimize the output.");
});

// html

gulp.task('html', function() {
	gulp.src(sourceFolder+"/html/*.html")
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(buildFolder+"/"))
			
		.pipe(browserSync.stream());
});

// css

gulp.task('css', function () {

	return gulp.src(sourceFolder+"/css/style.css")
		.pipe(sourcemaps.init())
		.on("error", errorHandler)
		
		.pipe(autoprefixer(autoprefixerConfig))
		.on("error", errorHandler)

		.pipe(minCSS(mincssConfig))
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(buildFolder+"/css"))
		.pipe(rename("style.min.css"))

		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Js

gulp.task('js', function () {

	return gulp.src(sourceFolder+"/js/**/*.js")
		.pipe(sourcemaps.init())

		.pipe(concat("main.js"))
		.on("error", errorHandler)

		.pipe(productionBuild ? uglify() : gutil.noop())
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(buildFolder+"/js"))

		.pipe(browserSync.stream());
});

// Watchers

gulp.task('watch-task', function () {

	gulp.watch(sourceFolder+"/html/**/*", ['html']).on('change', browserSync.reload);
	gulp.watch(sourceFolder+"/css/**/*.css", ['css']);
	gulp.watch(sourceFolder+"/js/**/*.js", ['js']).on('change', browserSync.reload);

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
