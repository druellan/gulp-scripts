Sfida Project
==================

#### Code variables and switches

File `_main.js` variable DEBUG can be used to activate the Javascript console debug. It is important to disable this on production, since IE9/IE10 can throw errors on execution.

#### Gulp
A gulp.js config file is included on the root folder, to help build the project.

##### To install Gulp:
[node.js](http://nodejs.org/) is required. Once you have node.js installed, install `gulp` globally:
```
npm install gulp --global
```

##### To install dependecies:
Navigate to the project's root folder and install dependencies via `npm`:
```
npm install
```

##### Usage
* `gulp` for a list of commands
* `gulp build` to build the production files
* `gulp watch` to watch changes on the code, and build if necessary.
* `gulp serve` to watch changes and push the changes via Browser-sync.

##### Minification
Minification is disabled by default. Can be enabled in the `gulpfile.js` ot just using: 
```
gulp build --production
```

*This document is a work in progress. Specifications and dependencies can change without notice.*
