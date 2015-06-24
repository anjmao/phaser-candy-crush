var destServer = './src/';
	
var srcServer = './src/',
    srcPublic = './src/public/',
	 srcAngular = srcPublic + 'app/';

var config = {
	tsCompiler : { module: 'commonjs'},
	tsServerSrc : [
		srcServer + '**/*.ts',
		'!'+srcPublic+'**/*.ts'
	],
	jsServerSrc : [
		srcServer + '**/*.js',
		'!'+srcPublic+'**/*.js'
	],
	tsPublicSrc : [
	    srcAngular + '**/*.ts',
		'!'+srcAngular + 'typings**/*.ts'
	],
	publicJsInject : [
		 srcAngular + '**/*.js'
	],
	mainFile : destServer + 'App.js',
	destServer : destServer,
	destPublic : srcAngular,
	srcServer : srcServer
};

module.exports = config;