/// <reference path='../_references.ts' />

module GameApp.Objects {
	'use strict';

   interface ILevel{	
		shuffle(): Array<any>; //TODO: change any
		cookieAtColumn(column: number, row: number): ICookie;
	}
	
	export class Level implements ILevel{
		numColumns: number = Config.numColumns;
		numRows: number = Config.numColumns;
		
		cookies: ICookie[][];
		
		shuffle(): Array<any>{
			return [];
		}
		
		cookieAtColumn(column: number, row: number){
			if(column >= 0 && column < this.numColumns){
				throw 'Invalid column: '+ column;
			}
			if(row >= 0 && row < this.numRows){
				throw 'Invalid row: '+ row;
			}
			return this.cookies[column][row]
		}
	}
}