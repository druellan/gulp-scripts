// Main dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

// HTML dependencies
var fileinclude = require('gulp-file-include');

// sass/CSS dependencies
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// JS dependencies
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// SVG dependencies
var svgSprite = require('gulp-svg-sprite');

// Dev Tools
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncConfig = false;
try {
	browserSyncConfig = require('./bs-config.js');
} catch(e){};


// Options for compilation/concatenation/parsing

var buildFolder = "./build";
var sassSettings = {
	src: "./sass/style.scss",
	dest: buildFolder+"/css",
	destfilename: "style.css",
	watch: "./sass/**/*",
	config: { compatibility: 'ie8', keepBreaks: true }
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
var svgSettings = {
	src: "./svg/*.svg",
	dest: buildFolder,
    config: {
	    mode                : {
	        symbol          : {
				sprite			: 'sprites.svg'
			}
	    }
	}
};

// Watchers

var serveWatch = [ "src/*.html", "src/*.php" ];

// Default tasks

gulp.task('build', ['html', 'sass', 'js', 'svg']);
gulp.task('watch', ['html', 'sass', 'js', 'svg', 'watch-task']);
gulp.task('serve', ['html', 'sass', 'js', 'svg', 'browsersync', 'watch-task']);

gulp.task('default', function(){
	gutil.log("Use ", "[gulp build] to build the project.");
	gutil.log("Use ", "[gulp css] to compile the SASS CSS [watcheable].");
	gutil.log("Use ", "[gulp js] to compile the JS functions [watcheable].");

	gutil.log("Use ", "[gulp html] to compile the HTML template [watcheable].");
	gutil.log("Use ", "[gulp svg] to compile the SVG spriters.");

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

// sass

gulp.task('sass', function () {

	return gulp.src(sassSettings.src)
		.pipe(rename(sassSettings.destfilename))
		.pipe(sourcemaps.init())

		.pipe(sass())
		.on("error", errorHandler)

		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
        }))
		.on("error", errorHandler)

		.pipe(minifyCSS(sassSettings.config))
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(sassSettings.dest))

		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Js

gulp.task('js', function () {

	return gulp.src(jsSettings.src)
		.pipe(sourcemaps.init())

		.pipe(concat(jsSettings.destfilename))
		.on("error", errorHandler)

//		.pipe(uglify())
//		.on("error", errorHandler)

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
	gulp.watch(sassSettings.watch, ['sass']);
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
