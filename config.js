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
		 '!'+srcAngular + 'game/**/*.ts',
		 '!'+srcAngular + 'typings**/*.ts'
	],
	tsGameSrc : [
	    srcAngular + 'game/**/*.ts',
		'!'+srcAngular + 'typings**/*.ts'
	],
	publicJsInject : [
		 srcAngular + '**/*.js'
	],
	mainFile : destServer + 'app.js',
	destServer : destServer,
	destPublic : srcPublic,
	srcServer : srcServer
};

module.exports = config;