/// <reference path='../_references.ts' />


module GameApp.Models {
	'use strict';

   export interface IJsonLevel {
		tiles: number[][];
		targetScore: number;
		moves: number
	}

	export class Level {
		
		cookies: Cookie[][];
		tiles: Tile[][];
		possibleSwaps: Swap[];
		
		config: Config;

		constructor(gameConfig: Config) {
			this.config = gameConfig;
			this.createCookiesArray();
		}

		shuffle(): Array<Cookie> {
			var set: Cookie[];

			do {
				set = this.createInitialCookies();
				this.detectPossibleSwaps();
			}
			while (this.possibleSwaps.length == 0)

         console.log(this.possibleSwaps);

			return set;
		}

		isPossibleSwap(other: Swap): boolean {

			for (var i = 0; i < this.possibleSwaps.length; i++) {
				var possibleSwap = this.possibleSwaps[i];

				var isPossible = (this.isTwoCookiesEquals(other.cookieA, possibleSwap.cookieA) && this.isTwoCookiesEquals(other.cookieB, possibleSwap.cookieB)) ||
					(this.isTwoCookiesEquals(other.cookieB, possibleSwap.cookieA) && this.isTwoCookiesEquals(other.cookieA, possibleSwap.cookieB));

				if (isPossible) return true;
			}

			return false;
		}

		getPossibleSwaps(): Swap[] {
			return this.possibleSwaps;
		}


		createInitialCookies(): Array<Cookie> {
			var array: Cookie[] = [];
			for (var row: number = 0; row < this.config.numRows; row++) {
				for (var column: number = 0; column < this.config.numColumns; column++) {

					if (this.tiles[column][row] != null) {
						var cookieType: CookieType = this.calculateCookieType(column, row);
						var cookie: Cookie = this.createCookieAtColumn(column, row, cookieType);
						array.push(cookie);
					}
					else {
						this.cookies[column][row] = null;
					}

				}
			}

			return array;
		}


		cookieAtPosition(column: number, row: number) {
			return this.cookies[column][row]
		}


		tileAtColumn(column: number, row: number): Tile {
			return this.tiles[column][row]
		}

		initWithData(level: IJsonLevel) {
			this.createTilesArray();

			for (var row: number = 0; row < this.config.numRows; row++) {
				for (var column: number = 0; column < this.config.numColumns; column++) {
					var tile = level.tiles[column][row];

					if (tile == 1) {
						this.tiles[column][row] = new Tile();
					}
					else {
						this.tiles[column][row] = null;
					}
				}
			}
		}

		performSwap(swap: Swap) {
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

		removeMatches(): Chain[] {
			var horizontalChains = this.detectHorizontalMatches();
			var verticalChains = this.detectVerticalMatches();

			this.removeCookies(horizontalChains);
			this.removeCookies(verticalChains);
			
			this.calculateScores(horizontalChains);
			this.calculateScores(verticalChains);

			return horizontalChains.concat(verticalChains);
		}


		calculateScores(chains: Chain[]) {
			chains.forEach((chain) => {
				chain.score = 60 * (chain.cookies.length - 2);
			});
		}

		fillHoles(): any[] {
			var columns = [];
 
			// 1
			for (var column = 0; column < this.config.numColumns; column++) {

				var array: Cookie[];
				for (var row = 0; row < this.config.numRows; row++) {
 
					// 2
					if (this.tiles[column][row] != null && this.cookies[column][row] == null) {
 
						// 3
						for (var lookup = row + 1; lookup < this.config.numRows; lookup++) {
							var cookie = this.cookies[column][lookup];
							if (cookie != null) {
								// 4
								this.cookies[column][lookup] = null;
								this.cookies[column][row] = cookie;
								cookie.row = row;
 
								// 5
								if (array == null) {
									array = [];
									columns.push(array);
								}
								array.push(cookie);
 
								// 6
								break;
							}
						}
					}
				}
			}
			return columns;
		}

		topUpCookies() {
			var columns = [];

			var cookieType = 0;

			for (var column = 0; column < this.config.numColumns; column++) {

				var array: Cookie[];
 
				// 1
				for (var row = this.config.numRows - 1; row >= 0 && this.cookies[column][row] == null; row--) {
 
					// 2
					if (this.tiles[column][row] != null) {
 
						// 3
						var newCookieType: CookieType;
						do {
							newCookieType = GameHelpers.getRandomNumber(6);
						} while (newCookieType == cookieType);
						cookieType = newCookieType;
 
						// 4
						var cookie = this.createCookieAtColumn(column, row, newCookieType);
 
						// 5
						if (array == null) {
							array = [];
							columns.push(array);
						}
						array.push(cookie);
					}
				}
			}
			
			this.detectPossibleSwaps();
			
			return columns;
		}

		private createCookieAtColumn(column: number, row: number, cookieType: CookieType): Cookie {
			var cookie = new Cookie(column, row, cookieType);
			this.cookies[column][row] = cookie;
			return cookie;
		}

		private createCookiesArray() {
			this.cookies = new Array(this.config.numColumns - 1);
			for (var i = 0; i < this.config.numColumns; i++) {
				this.cookies[i] = new Array(this.config.numRows - 1);
			}
		}

		private createTilesArray() {
			this.tiles = new Array(this.config.numColumns - 1);
			for (var i = 0; i < this.config.numColumns; i++) {
				this.tiles[i] = new Array(this.config.numRows - 1);
			}
		}
		
		private isTwoCookiesEquals(cookieA: Cookie, cookieB: Cookie) {
			return cookieA.column == cookieB.column && cookieA.row == cookieB.row && cookieA.cookieType == cookieB.cookieType;
		}

		private hasChainAtColumn(column: number, row: number): boolean {

			var cookie = this.cookies[column][row],
				cookieType: CookieType;

			if (cookie) {
				cookieType = cookie.cookieType;
			}
			else {
				cookieType = 0;
			}

			var horzLength = 1;
			for (var i = column - 1; i >= 0 && this.cookies[i][row] && this.cookies[i][row].cookieType == cookieType; i-- , horzLength++);
			for (var i = column + 1; i < this.config.numColumns && this.cookies[i][row] && this.cookies[i][row].cookieType == cookieType; i++ , horzLength++);
			if (horzLength >= 3) return true;

			var vertLength = 1;
			for (var i = row - 1; i >= 0 && this.cookies[column][i] && this.cookies[column][i].cookieType == cookieType; i-- , vertLength++);
			for (var i = row + 1; i < this.config.numRows && this.cookies[column][i] && this.cookies[column][i].cookieType == cookieType; i++ , vertLength++);
			return (vertLength >= 3);
		}

		private detectPossibleSwaps() {
			var possibleSwaps: Swap[] = [];

			for (var row = 0; row < this.config.numRows; row++) {
				for (var column = 0; column < this.config.numColumns; column++) {

					var cookie = this.cookies[column][row];
					if (cookie) {
 
						// Is it possible to swap this cookie with the one on the right?
						if (column < this.config.numColumns - 1) {
							// Have a cookie in this spot? If there is no tile, there is no cookie.
							var other = this.cookies[column + 1][row];
							if (other) {
								// Swap them
								this.cookies[column][row] = other;
								this.cookies[column + 1][row] = cookie;
 
								// Is either cookie now part of a chain?
								if (this.hasChainAtColumn(column + 1, row) ||
									this.hasChainAtColumn(column, row)) {

									var swap = new Swap();
									swap.cookieA = cookie;
									swap.cookieB = other;
									possibleSwaps.push(swap);
								}
 
								// Swap them back
								this.cookies[column][row] = cookie;
								this.cookies[column + 1][row] = other;
							}
						}

						if (row < this.config.numRows - 1) {

							var other = this.cookies[column][row + 1];
							if (other) {
								// Swap them
								this.cookies[column][row] = other;
								this.cookies[column][row + 1] = cookie;

								if (this.hasChainAtColumn(column, row + 1) ||
									this.hasChainAtColumn(column, row)) {

									var swap = new Swap();
									swap.cookieA = cookie;
									swap.cookieB = other;
									possibleSwaps.push(swap);
								}

								this.cookies[column][row] = cookie;
								this.cookies[column][row + 1] = other;
							}
						}
					}
				}
			}

         this.possibleSwaps = possibleSwaps;
		}

		private calculateCookieType(column: number, row: number): CookieType {
			var cookieType: CookieType;

			do {
				cookieType = GameHelpers.getRandomNumber(this.config.numCookieTypes);
			}
			while (this.whereIsAlreadyTwoCookies(column, row, cookieType))

			return cookieType;
		}

		private whereIsAlreadyTwoCookies(column: number, row: number, cookieType: CookieType): boolean {

			return (column >= 2 &&
				this.cookies[column - 1][row] &&
				this.cookies[column - 2][row] &&
				this.cookies[column - 1][row].cookieType == cookieType &&
				this.cookies[column - 2][row].cookieType == cookieType)
				||
				(row >= 2 &&
					this.cookies[column][row - 1] &&
					this.cookies[column][row - 2] &&
					this.cookies[column][row - 1].cookieType == cookieType &&
					this.cookies[column][row - 2].cookieType == cookieType)
		}

		private detectHorizontalMatches(): Chain[] {

			var set: Chain[] = [];

			for (var row = 0; row < this.config.numRows; row++) {
				for (var column = 0; column < this.config.numColumns - 2;) {
					if (this.cookies[column][row] != null) {
						var matchType = this.cookies[column][row].cookieType;

						if (this.cookies[column + 1][row] && this.cookies[column + 1][row].cookieType == matchType &&
							this.cookies[column + 2][row] && this.cookies[column + 2][row].cookieType == matchType) {

							var chain = new Chain();
							chain.chainType = ChainType.chainTypeHorizontal;

							do {
								chain.addCookie(this.cookies[column][row]);
								column += 1;
							}
							while (column < this.config.numColumns && this.cookies[column][row] && this.cookies[column][row].cookieType == matchType);

							set.push(chain);

							continue;
						}
					}

					column += 1;
				}
			}
			return set;
		}

		private detectVerticalMatches(): Chain[] {
			var set: Chain[] = [];

			for (var column = 0; column < this.config.numColumns; column++) {
				for (var row = 0; row < this.config.numRows - 2;) {
					if (this.cookies[column][row] != null) {
						var matchType = this.cookies[column][row].cookieType;

						if (this.cookies[column][row + 1] && this.cookies[column][row + 1].cookieType == matchType &&
							this.cookies[column][row + 2] && this.cookies[column][row + 2].cookieType == matchType) {

							var chain = new Chain();
							chain.chainType = ChainType.chainTypeVertical;

							do {
								chain.addCookie(this.cookies[column][row]);
								row += 1;
							}
							while (row < this.config.numRows && this.cookies[column][row] && this.cookies[column][row].cookieType == matchType);

							set.push(chain);
							continue;
						}
					}
					row += 1;
				}
			}
			return set;
		}

		private removeCookies(chains: Chain[]) {
			chains.forEach((chain) => {
				chain.cookies.forEach((cookie) => {
					this.cookies[cookie.column][cookie.row] = null;
				})
			});
		}

	}
}