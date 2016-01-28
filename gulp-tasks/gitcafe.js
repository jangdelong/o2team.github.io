
require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        gcPath = '../../../gitcafe/o2/o2labs';

    cp('-Rf', 'public/*', gcPath);
    cd(gcPath);
	rm('CNAME');
	rm('baidu*.html');
	if (exec('git commit -am "Super 凹凸MAN"').code !== 0) {
		echo('Error: Git commit failed for gitcafe');
		exit(1);
	}
	exec('git push origin gitcafe-pages');
	
};
