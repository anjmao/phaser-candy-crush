/// <reference path='../_references.ts' />

module GameApp.Objects {
	'use strict';

	export interface ICookieModel {
		column: number;
		row: number;
		cookieType: CookieType;
		sprite: any;
	}
	
	export interface ICookie extends ICookieModel{
		spriteName(): string;
		highlightedSpriteName(): string;
	}
	
	export enum CookieType{
		croissant = 1,
			cupcake = 2,
			danish = 3,
			donut = 4,
			macaroon = 5,
			sugarCookie = 6
	}

	export class Cookie implements ICookie {
		column: number;
		row: number;
		cookieType: number;
		sprite: any;

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