/// <reference path='../_references.ts' />

module GameApp.Models {
	'use strict';

   export interface IJsonLevel{
		tiles: number[][];
		targetScore: number;
		moves: number
	}

	export class Level {
		numColumns: number = Config.numColumns;
		numRows: number = Config.numColumns;
		
		cookies: Cookie[][];
		tiles: Tile[][];
		
		constructor(){
			this.createCookiesArray();
		}

		shuffle(): Array<Cookie> {
			return this.createInitialCookies();
		}

		createInitialCookies(): Array<Cookie> {
			var array: Cookie[] = [];
			for (var row: number = 0; row < this.numRows; row++) {
				for (var column: number = 0; column < this.numColumns; column++) {
					 
					if(this.tiles[column][row] != null){
						var cookieType: CookieType = GameHelpers.getRandomNumber(Config.numCookieTypes);
					   var cookie: Cookie = this.createCookieAtColumn(column, row, cookieType);
						array.push(cookie);
					}
					
				}
			}

			return array;
		}

	   cookieAtColumn(column: number, row: number) {
			return this.cookies[column][row]
		}

	   private createCookieAtColumn(column: number, row: number, cookieType: CookieType): Cookie {
			
			var cookie = new Cookie(column, row, cookieType);

			this.cookies[column][row] = cookie;

			return cookie;
		}

		private createCookiesArray() {
			this.cookies = new Array(this.numColumns-1);
			for (var i = 0; i < this.numColumns; i++) {
				this.cookies[i] = new Array(this.numRows-1);
			}
		}
		
	   private createTilesArray() {
			this.tiles = new Array(this.numColumns-1);
			for (var i = 0; i < this.numColumns; i++) {
				this.tiles[i] = new Array(this.numRows-1);
			}
		}
		
	   tileAtColumn(column: number, row: number): Tile{
			return this.tiles[column][row]
		}
		
		initWithLevel(level: IJsonLevel){
			this.createTilesArray();
			
			for (var row: number = 0; row < this.numRows; row++) {
				for (var column: number = 0; column < this.numColumns; column++) {
                var tile = level.tiles[column][row];
					 
					 if(tile == 1){
						 this.tiles[column][row] = new Tile();
					 }
					 else{
						 this.tiles[column][row] = null;
					 }
				}
			}
		}
		
		performSwap(swap: Swap){
			var columnA: number = swap.cookieA.column,
				 rowA: number = swap.cookieA.row,
				 columnB: number = swap.cookieB.column,
				 rowB: number = swap.cookieB.row;
				 
			this.cookies[columnA][rowA] = swap.cookieB;
			swap.cookieB.column = columnA;
			swap.cookieB.row = rowA;
			
			this.cookies[columnB][rowB] = swap.cookieA;
			swap.cookieA.column = columnB;
			swap.cookieA.row = rowB;
			
		}
		
	}
}