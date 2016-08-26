var doCss = true;
var doJs = true;
var doHtml = true;
var doDeploy = false;
var doAutodeploy = false;

// Main dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

// FTP
var sftp = require('gulp-sftp');

// CSS dependencies
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

// HTML dependencies
var fileinclude = require('gulp-file-include');

// JS dependencies
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Dev Tools
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncConfig = false;
try {
	browserSyncConfig = require('./bs-config.js');
} catch(e){}


// Options for compilation/concatenation/parsing

var buildFolder     = "./static";
var sourceFolder    = "./src";
var productionBuild = gutil.env.production;

var autoprefixerConfig = {
	browsers: [ "last 4 versions", "ie >= 9", "> 5%" ],
	cascade: false
};

var cleancssConfig = {
	keepBreaks: !productionBuild,
	keepSpecialComments: true,
	processImport: true,
	relativeTo: sourceFolder+"/css",
	rebase: false
};

if ( doDeploy ) {
	var config = require('./sftp-config.json');
	var watchSrc = [buildFolder+'/**/*.{css,js,gif,png,php,eot,svg,ttf,woff}', '!'+buildFolder+'/src/**/*'];

	var sftpConfig = {
		host: config.host,
		port: config.port,
		user: config.user,
		pass: config.password,
		remotePath: config.remote_path + "/"+buildFolder,
		timeout: 30000,
		log: gutil.log
	};
}

// Default tasks

gulp.task('build', ['hrml', 'css', 'js']);
gulp.task('watch', ['hrml', 'css', 'js', 'watch-task']);
gulp.task('serve', ['hrml', 'css', 'js', 'browsersync', 'watch-task']);

gulp.task('default', function(){
	gutil.log("Use ", "[gulp build] to build the project.");

	if (doCss) gutil.log("Use ", "[gulp css] to compile the CSS [watcheable].");
	if (doJs) gutil.log("Use ", "[gulp js] to compile the JS functions [watcheable].");
	if (doHtml) gutil.log("Use ", "[gulp html] to compile the HTML template [watcheable].");

	if (doDeploy) gutil.log("Use ", "[gulp deploy] to upload the static code.");

	gutil.log("Use ", "[gulp serve] to build, watch, [deploy] and start the Browsersync server.");
	gutil.log("Use ", "[gulp --production] flag to minimize and further optimize the output.");
});

// css

gulp.task('css', function () {

	if ( doCss )
		return gulp.src(sourceFolder+"/css/style.css")
		.pipe(sourcemaps.init())
		.on("error", errorHandler)

		.pipe(autoprefixer(autoprefixerConfig))
		.on("error", errorHandler)

		.pipe(cleanCSS(cleancssConfig))
		.on("error", errorHandler)

		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(buildFolder+"/css"))
		.pipe(rename("style.css"))

		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Js

gulp.task('js', function () {

	if ( doJs )
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

// html

gulp.task('html', function() {

	if ( doHtml )
		return gulp.src(sourceFolder+"/html/*.html")
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(buildFolder))

		.pipe(browserSync.stream());
});

// Deploy

gulp.task('deploy', function() {

	if ( doDeploy )
		return gulp.src(watchSrc)
		.pipe(sftp(sftpConfig))
		.on("error", errorHandler);
});

// Watchers

gulp.task('watch-task', function () {

	gulp.watch(sourceFolder+"/css/**/*.css", ['css']);
	gulp.watch(sourceFolder+"/js/**/*.js", ['js']);

	if ( doAutodeploy )
		gulp.watch(watchSrc, { ignoreInitial: true }, function(file) {
			gulp.src(file.path, { buffer:false })
			.pipe(sftp(sftpConfig))
			.on("error", errorHandler);
		} );

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
