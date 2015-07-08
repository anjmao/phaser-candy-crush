/// <reference path='../_references.ts' />

module GameApp.Objects {
	'use strict'; 
	
	interface IConfig{
	   numColumns: number;
		numRows: number;
		
	}
	
   export class Config{
		static numColumns: number = 9;
		static numRows: number = 9;
	}
}