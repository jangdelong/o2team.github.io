require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        pngquant = require('imagemin-pngquant'),
        imgRegx = /.*(.jpg|.jpeg|.png)$/;
        //ignore gif, because it will crash imagemin
    
    echo('------ O2 is proccessing your images ------');
    
    return gulp.src(dirs.public + '/img/**/*', {base: dirs.public})
        //.pipe($.ignore.include(/.*(.jpg|.jpeg|.ico|.webp|.png|.gif)$/))
        .pipe($.ignore.include(function(file){
            return imgRegx.test(file.path);    
        }))
        .pipe($.newer(dirs.hidden))
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox:false}],
            use:[pngquant()]
        }))
        // in order to make newer work, we need to put a copy to the hidden folder
        .pipe(gulp.dest(dirs.hidden))
        // override the raw files
        .pipe(gulp.dest(dirs.public));
};
