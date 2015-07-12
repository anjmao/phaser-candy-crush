/// <reference path='_references.ts' />

module GameApp {
	'use strict';

	 export function GameDirective($injector): ng.IDirective {
		
		var linkFn = function(scope, ele, attrs) {
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