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
		'!'+clientApp + 'typings**/*.ts'
	],
	publicJsInject : [
		 clientApp + '**/*.js'
	],
	mainFile : destServer + 'app.js',
	destServer : destServer,
	destPublic : srcPublic,
	srcServer : srcServer,
	
	bowerFiles: srcPublic + 'libs',
	
	specHelpers: [clientApp + 'test-helpers/*.js']
	
};

config.karma = getKarmaOptions();

function getKarmaOptions() {
	var options = {
		files: [].concat(
			config.bowerFiles,
			config.specHelpers,
			clientApp + 'game/TODO'
		)
	};
	return options;
}

module.exports = config;