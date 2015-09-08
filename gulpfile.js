var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var harp = require('harp');
var concat = require('gulp-concat');
var deploy = require('gulp-gh-pages');
var exec = require("child_process").exec;

gulp.task('serve', function() {
    harp.server('.', {
        port: 3000
    }, function() {
        browserSync.init(__dirname, {
            proxy: "localhost:3000",
            port: 9000,
            open: false,
        });
        gulp.watch("./**/*.{styl,sass,scss,less}", function() {
            reload("style.css", {stream: true});
        });

        gulp.watch("./**/*.{ejs,jade,haml,json}", reload);
    });
});

gulp.task('browserify-css', function(done){
    exec('browserify -t browserify-css public/app/app.js > public/dist/bundle.js');
});

gulp.task('build', function(done) {
    exec('harp compile . www', {stdio: 'inherit'}).on('close', done);
});

gulp.task('deploy', ['build'], function() {
    return gulp.src("./www/**/*").pipe(deploy({branch: 'master'}));
});

gulp.task('default', ['serve']);
