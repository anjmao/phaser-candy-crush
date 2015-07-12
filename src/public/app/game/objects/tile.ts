/// <reference path='../_references.ts' />

module GameApp.Objects {
	'use strict';
    
	 export interface ITile{
		 tileAtColumn (column: number, row: number): Tile;
	 }
	 
	 export class Tile implements ITile{
		 
		 tileAtColumn(column: number, row: number): Tile{
			 return null;
		 }
	 }
}