// Main dependencies

var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var cache = require('gulp-cache');

// Less/CSS dependencies

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// JS dependencies

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Img dependencies

var imagemin = require('gulp-imagemin');

// Dev Tools

var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncConfig = false;
try {
	browserSyncConfig = require('./bs-config.js');
} catch(e){};


// Options for compilation/concatenation/parsing

var compile = {
	"less": {
		src: "./src/less/style.less",
		dest: "./css",
		destfilename: "style.css",
		watch: "./src/less/**/*"
	},
	"js": {
		src: "./src/js/**/*.js",
		dest: "./js",
		destfilename: "main.js",
		watch: "./src/js/**/*.js"
	},
	"img": {
		src: "./src/img/**/*",
		dest: "./img",
		watch: "./src/img/**/*"
	}
};

// Watchers

var serveWatch = [ "*.html", "*.php" ];

// Default tasks

gulp.task('default', ['less', 'js', 'images']);
gulp.task('watch', ['less', 'js', 'images', 'watch-task']);
gulp.task('serve', ['less', 'js', 'images', 'browsersync', 'watch-task']);

// Less

gulp.task('less', function () {

	return gulp.src(compile.less.src)
		.pipe(rename(compile.less.destfilename))
		.pipe(sourcemaps.init())

		.pipe(less())
		.on("error", errorHandler)

		.pipe(autoprefixer('last 3 versions'))
		.on("error", errorHandler)

//		.pipe(minifyCSS({compatibility: 'ie8'}))
//		.on("error", errorHandler)
//		.pipe(rename({suffix: '.min'}))

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(compile.less.dest))

		.pipe(browserSync.stream());
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

// Images

gulp.task('images', function() {

  return gulp.src(compile.img.src)
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: false, interlaced: false })))
	.pipe(gulp.dest(compile.img.dest))
	.pipe(browserSync.reload);
});

// Watchers

gulp.task('watch-task', function () {

	gulp.watch(compile.less.watch, ['less']);
	gulp.watch(compile.js.watch, ['js']);
	gulp.watch(compile.img.watch, ['images']);

	gulp.watch(serveWatch).on('change', browserSync.reload);

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
