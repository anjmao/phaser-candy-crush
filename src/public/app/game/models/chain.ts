/// <reference path='../_references.ts' />

module GameApp.Models {
	'use strict';

	export enum ChainType {
		chainTypeHorizontal,
		chainTypeVertical
	}

   export class Chain {
		cookies: Cookie[];
		chainType: ChainType;
		score: number;

		addCookie(cookie: Cookie) {
			if (this.cookies == null) {
				this.cookies = [];
			}
			this.cookies.push(cookie);
		}

		getCookies(): Cookie[] {
			return this.cookies;
		}

	}
}