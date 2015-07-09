/// <reference path='../_references.ts' />

module GameApp.Objects {
	'use strict';

   interface ILevel{	
		shuffle(): Array<ICookieModel>; //TODO: change any
		createInitialCookies(): Array<ICookieModel>;
		cookieAtColumn(column: number, row: number): ICookieModel;
		createCookieAtColumn(column: number, row: number, cookieType: CookieType): ICookieModel
	}
	
	export class Level implements ILevel{
		numColumns: number = Config.numColumns;
		numRows: number = Config.numColumns;
		
		cookies: ICookieModel[][];
		
		shuffle(): Array<ICookieModel>{
			return this.createInitialCookies();
		}
		
		createInitialCookies(): Array<any>{
			var array = [];
			for(var row: number = 0; row < this.numRows; row++){
				for(var column: number = 0; column < this.numColumns; column++){
					
					var cookieType: CookieType = GameHelpers.getRandomNumber(Config.numCookieTypes);
					
					var cookie: ICookieModel = this.createCookieAtColumn(column, row, cookieType);
					
					array.push(cookie);
				}
			}
			
			return array;
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
		
		createCookieAtColumn(column: number, row: number, cookieType: CookieType): ICookieModel{
			var cookie: ICookieModel = {
				cookieType : cookieType,
				column : column,
				row : row,
				sprite : null
			};
			
			this.cookies[column][row] = cookie;
			
			return cookie;
		}
	}
}