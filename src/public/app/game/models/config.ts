/// <reference path='../_references.ts' />

module GameApp.Models {
	'use strict'; 
	
   export class Config{
		numColumns: number;
		numRows: number;
		numCookieTypes;
		
		constructor(numColumns: number, numRows: number, numCookieTypes: number){
			this.numColumns = numColumns;
			this.numRows = numRows;
			this.numCookieTypes = numCookieTypes;
		}
	}
}