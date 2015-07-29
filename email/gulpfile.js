// Main dependencies

var gulp = require('gulp');
var gutil = require('gulp-util');
var newer = require('gulp-newer');

// Premailer

var premailer = require('gulp-premailer');

// Img dependencies

var imagemin = require('gulp-imagemin');

// Mailer

var mail = require('gulp-mail');
var mailOptions = false;
try {
	mailOptions = require('./testmail.js');
} catch(e){};

// Litmus

var litmus = require('gulp-litmus');
var litmusConfig = {
    username: '',
    password: '',
    url: '',
    applications: [
        'chromeyahoo',
		'ffyahoo',
		'yahoo'
    ]
};

// Options for compilation/concatenation/parsing

var compile = {
	"img": {
		src: "src/img/*.{gif,jpg,png,svg}",
		dest: "build/img/"
	},
	"premailer": {
		src: "src/*.html",
		dest: "build/"
	},
	"testmail": {
		src: "build/index_t3.html",
		dest: "build/"
	}
};


// Default tasks

gulp.task('default', ['images', 'premailer']);
gulp.task('email', ['images', 'premailer', 'testmail']);
gulp.task('litmus', ['images', 'premailer', 'litmus-task']);

// Images

gulp.task('images', function() {

  return gulp.src(compile.img.src)
	.pipe(newer(compile.img.dest))
	.pipe(imagemin({ optimizationLevel: 3, progressive: false, interlaced: false }))
	.pipe(gulp.dest(compile.img.dest));
});

// Premailer inline thing

gulp.task('premailer', function() {
    return gulp.src(compile.premailer.src)
		.pipe(premailer())
    	.pipe(gulp.dest(compile.premailer.dest));
});

// Testmail

gulp.task('testmail', function() {
    return gulp.src(compile.testmail.src)
		.pipe(mail(mailOptions))
		.pipe(gulp.dest(compile.testmail.dest));
});

// Litmus

gulp.task('litmus-task', function () {
    return gulp.src(compile.testmail.src)
        .pipe(litmus(litmusConfig))
		.pipe(gulp.dest(compile.testmail.dest));
});

gulp.task('watch', function () {
	gulp.watch("src/**/*", ['premailer']);
});

// Small, portable, cute error handler

var errorHandler = function(err) {

	gutil.log(err);
	gutil.beep();
	this.emit('end');
};
