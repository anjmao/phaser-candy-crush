/// <reference path='_references.ts' />

module GameApp {
	'use strict';
	
   export class IndexController{
		constructor()
		{
			console.log('Game started')
		}
	}
	
	angular.module('GameApp').controller('IndexController', IndexController)
	
	
}

