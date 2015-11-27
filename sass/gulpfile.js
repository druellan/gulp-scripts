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

// Dev Tools
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncConfig = false;
try {
	browserSyncConfig = require('./bs-config.js');
} catch(e){};


// Options for compilation/concatenation/parsing

var buildFolder = "./build";
var compile = {
	"sass": {
		src: "./sass/style.scss",
		dest: buildFolder+"/css",
		destfilename: "style.css",
		watch: "./sass/**/*"
	},
	"js": {
		src: "./js/**/*.js",
		dest: buildFolder+"/js",
		destfilename: "main.js",
		watch: "./js/**/*.js"
	},
	"html": {
		src: "./html/*.html",
		dest: buildFolder+"/",
		watch: "./html/**/*"
	}
};

// Watchers

var serveWatch = [ "src/*.html", "src/*.php" ];

// Default tasks

gulp.task('build', ['html', 'sass', 'js']);
gulp.task('watch', ['html', 'sass', 'js', 'watch-task']);
gulp.task('serve', ['html', 'sass', 'js', 'browsersync', 'watch-task']);

gulp.task('default', function(){
	gutil.log("Use ", "[gulp build] to build the project.");
	gutil.log("Use ", "[gulp html] to compile the HTML template [watcheable].");
	gutil.log("Use ", "[gulp css] to compile the SASS CSS [watcheable].");
	gutil.log("Use ", "[gulp js] to compile the JS functions [watcheable].");
	gutil.log("Use ", "[gulp svg] to compile the SVG spriters.");
	gutil.log("Use ", "[gulp serve] to build, watch and start the Browsersync server.");
});

// html

gulp.task('html', function() {
	gulp.src(compile.html.src)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(rename({prefix: 'frontdev.'}))
		.pipe(gulp.dest(compile.html.dest));
});

// sass

gulp.task('sass', function () {

	return gulp.src(compile.sass.src)
		.pipe(rename(compile.sass.destfilename))
		.pipe(sourcemaps.init())

		.pipe(sass())
		.on("error", errorHandler)

		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
        }))
		.on("error", errorHandler)

		.pipe(minifyCSS({compatibility: 'ie8', keepBreaks: true}))
		.on("error", errorHandler)
//		.pipe(rename({suffix: '.min'}))

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(compile.sass.dest))

		.pipe(browserSync.stream()); // TODO: recheck this is the current method for inplace refresh
});

// Js

gulp.task('js', function () {

	return gulp.src(compile.js.src)
		.pipe(sourcemaps.init())

		.pipe(concat(compile.js.destfilename))
		.on("error", errorHandler)

//		.pipe(uglify())
//		.on("error", errorHandler)
//		.pipe(rename({suffix: '.min'}))

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(compile.js.dest))

		.pipe(browserSync.stream());
});

// Watchers

gulp.task('watch-task', function () {

	gulp.watch(compile.html.watch, ['html']);
	gulp.watch(compile.sass.watch, ['sass']);
	gulp.watch(compile.js.watch, ['js']);

	gulp.watch(compile.html.dest+"*.html").on('change', browserSync.reload);

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
