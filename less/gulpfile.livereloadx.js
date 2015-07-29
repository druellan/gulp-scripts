var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var path = require('path');

var compile = {
	"less": {
		src: "./src/less/style.less",
		dest: "./css",
		watch: "./src/less/*"
	},
	"js": {
		src: "./src/js/main.js",
		dest: "./js/",
		watch: "./src/js/*"
	}
};
var reload = [ "./css/*.css", "./img/*", "*.php", "*.module", "./js/*.js" ];

var errorHandler = function(err) {

	gutil.log(err);
	gutil.beep();
	this.emit('end');
};


// Default tasks

gulp.task('default', ['less', 'js']);
gulp.task('watch', ['watch-task']);
gulp.task('live', ['watch-task', 'livereload-task']);

// Less

gulp.task('less', function () {

	return gulp.src(compile.less.src)
		.pipe(sourcemaps.init())
		.pipe(less())
		.on("error", errorHandler)
		.pipe(autoprefixer('last 2 versions, last 5 chrome versions, last 5 firefox versions'))
		.on("error", errorHandler)
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(compile.less.dest));
});

// Js

gulp.task('js', function () {

	return gulp.src(compile.js.src)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.on("error", errorHandler)
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(compile.js.dest));
});

// Watchers

gulp.task('watch-task', function () {

	gulp.run('default');

	gulp.watch(compile.less.watch, ['less']);
  gulp.watch(compile.js.watch, ['js']);
//  gulp.watch('./img/*', ['images']);
//  gulp.watch('./svg/*', ['svg']);

});


gulp.task('livereload-task', function () {

	livereload.listen();

	gulp.watch(watchFiles.misc_watch).on('change', browserRefresh);

});
