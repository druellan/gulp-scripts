'use strict';

var gulp = require('gulp');  
var gutil = require( 'gulp-util' );  
var ftp = require( 'vinyl-ftp' );
var config = require('./ftp-config.json');
var gulpFilter = require('gulp-filter');

/** Configuration **/
var user = config.user;  
var password = config.password;  
var host = config.host;  
var port = config.port;
var remotepath = config.remotepath;

var filter = gulpFilter(['!.gitignore', '!ftp-config.json', '!node_module', '!gulpfile.js', '!package.json']);

var localFilesGlob = ['./**/*'];  


// helper function to build an FTP connection based on our configuration
function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        log: gutil.log
    });
}

/**
 * Deploy task.
 * Copies the new files to the server
 * @usage: gulp ftp-deploy
 * @usage: gulp ftp-deploy --file myfile
 */
gulp.task('ftp-deploy', function() {

    var conn = getFtpConnection();
    if ( gutil.env.file ) localFilesGlob = gutil.env.file;
    console.log(gutil.env);

    return gulp.src(localFilesGlob, { base: '.', buffer: false })
    	.pipe( filter )
        .pipe( conn.newer( remotepath ) ) // only upload newer files 
        .pipe( conn.dest( remotepath ) )
    ;
});


/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 */
gulp.task('ftp-deploy-watch', function() {

    var conn = getFtpConnection();

    gulp.watch(localFilesGlob)
    .on('change', function(event) {
      console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

      return gulp.src( [event.path], { base: '.', buffer: false } )
        .pipe( conn.newer( remotepath ) ) // only upload newer files 
        .pipe( conn.dest( remotepath ) )
      ;
    });
});