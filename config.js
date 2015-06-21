var destServer = 'src/';
	
var srcServer = 'src/',
    srcPublic = 'src/public/',
	 srcAngular = srcPublic + 'app/';

var config = {
	tsCompiler : { module: 'commonjs'},
	tsServerSrc : [
		srcServer + '**/*.ts',
		'!'+srcPublic+'**/*.ts'
	],
	tsPublicSrc : [
	    srcAngular + '**/*.ts',
		'!'+srcAngular + 'typings**/*.ts'
	],
	mainFile : destServer + 'App.js',
	destServer : destServer,
	destPublic : srcAngular,
	srcServer : srcServer
};

module.exports = config;