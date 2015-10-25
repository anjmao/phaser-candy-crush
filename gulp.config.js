var destServer = './src/';
	
var srcServer = './src/',
    srcPublic = './src/public/',
	 clientApp = srcPublic + 'app/';

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
	    clientApp + '**/*.ts',
		 '!'+clientApp + 'game/**/*.ts',
		 '!'+clientApp + 'typings**/*.ts'
	],
	tsGameSrc : [
	    clientApp + 'game/**/*.ts',
		'!'+clientApp + 'typings**/*.ts',
		'!'+clientApp + 'game/tests/**/*.ts'
	],
	publicJsInject : [
		 clientApp + '**/*.js'
	],
	mainFile : destServer + 'index.js',
	destServer : destServer,
	destPublic : srcPublic,
	srcServer : srcServer,
	clientApp : clientApp,
	gameTestsSrc: clientApp+ 'game/tests/**/*.ts',
	
	browserSync: [
		'public/**/*.*',
		"!" + 'public/app/game/tests/**/*.*'
	]
	
};

module.exports = config;