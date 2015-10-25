module GameApp{
	'use strict';
	
	export class GameHelpers{
		
		static getRandomNumber(maxNumber: number): number{
			return Math.floor((Math.random() * maxNumber) + 1);
		}
		
	}
	
}