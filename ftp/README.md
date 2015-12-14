FTP Deploy
==========

#### Gulp
A gulp.js config file is included on the root folder, to help build the project.

##### To install Gulp:
[node.js]{http://nodejs.org/} is required. Once you have node.js installed, install `gulp` globally:
```
npm install gulp --global
```

##### To install dependecies:
Navigate to the project's root folder and install dependencies via `npm`:
```
npm install
```

##### Usage
* `gulp ftp-deploy` to deploy new files to the FTP server
* `gulp ftp-deploy-watch` to watch for changes and deploy changed files to the FTP server

*This document is a work in progress. Specifications and dependencies can change without notice.*
