module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$;

     return gulp.src([dirs.fonts + '/**/*', dirs.imgs + '/**/*'], {base: dirs.public})
        .pipe(gulp.dest(dirs.assetsDir));
     
};
module.exports.dependencies = ['imgmin'];
module.exports.dependencies = [];
