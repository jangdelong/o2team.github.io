
require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$;

    cd('themes/lattice/');
    exec('git pull origin master');
    cd('../../');
    exec('git pull');
     
};
