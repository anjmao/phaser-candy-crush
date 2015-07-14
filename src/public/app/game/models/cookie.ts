/// <reference path='../_references.ts' />

module GameApp.Models {
	'use strict';

	
	
	export interface ICookie{
		column: number;
		row: number;
		cookieType: CookieType;
		sprite: Phaser.Sprite;
		
		spriteName?: () => string;
		highlightedSpriteName?: () => string;
	}
	
	export interface ICookiePosition{
		column: number;
		row: number;
	}
	
	
	export enum CookieType{
		croissant = 1,
			cupcake = 2,
			danish = 3,
			donut = 4,
			macaroon = 5,
			sugarCookie = 6
	}

	export class Cookie {
		column: number;
		row: number;
		cookieType: number;
		sprite: any;
		
		constructor(column: number,row: number,cookieType: number){
			this.column = column;
			this.row = row;
			this.cookieType = cookieType;
		}

	   spriteNames: Array<string> = [
			"Croissant",
			"Cupcake",
			"Danish",
			"Donut",
			"Macaroon",
			"SugarCookie"
		]

	    highlightedSpriteNames: Array<string> = [
			"Croissant-Highlighted",
			"Cupcake-Highlighted",
			"Danish-Highlighted",
			"Donut-Highlighted",
			"Macaroon-Highlighted",
			"SugarCookie-Highlighted",
		]


		spriteName(): string {
			return this.spriteNames[this.cookieType - 1];
		}
		highlightedSpriteName() {
         return this.highlightedSpriteNames[this.cookieType - 1];
		}
		
		//TODO: loging ?

	}
}