/// <reference path='_references.ts' />

module GameApp {
	'use strict';

	 export function GameDirective($injector): angular.IDirective {
		
		var linkFn = function(scope, ele, attrs) {
			//we pass $injector and scope for phaser game so it is possible to communicate with angular app
			new CandyGame(scope, $injector);
		};

		return {
			scope: {},
			template: '<div id="gameCanvas"></div>',
			link: linkFn
		}
	}

	GameDirective.$inject = ['$injector']

	angular.module('GameApp').directive('gameDirective',GameDirective)
} 