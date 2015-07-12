/// <reference path='../_references.ts' />

import GameObjects = GameApp.Objects;
import Level = GameApp.Objects.Level;
import IJsonLevel = GameApp.Objects.IJsonLevel;
import Cookie = GameObjects.Cookie;

module GameApp.States {
   'use strict';

   export class GamePlay extends Phaser.State {

      tileWidth: number = 64.0;
      tileHeight: number = 72.0;
      
      level: GameObjects.Level;
      
      cookieLayer: Phaser.Group;
      tilesLayer: Phaser.Group;
      
      
      private initLevel(levelName: string){
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         this.level = new Level();
         this.level.initWithLevel(levelData);
         this.addTiles();
      }

      create() {

         var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
         bg.anchor.setTo(0.5, 0.5);
         
         
         this.initLevel('level1');
         this.beginGame();

      }
      
      beginGame() {
         this.shuffle();
      }
      
      shuffle(){
         
         var cookies: Cookie[] = this.level.shuffle();
         this.addSpritesForCookies(cookies);
      }
      
      addSpritesForCookies(cookies: Cookie[]){
         
         this.cookieLayer = this.game.add.group();
         this.cookieLayer.z = 2;
         
         cookies.forEach((cookie: Cookie)=>{
            var point = this.pointForColum(cookie.column, cookie.row);
            this.cookieLayer.create(point.x, point.y, cookie.spriteName());
         })
      }
      
      pointForColum(column: number, row: number): Phaser.Point{
         return new Phaser.Point(column * this.tileWidth + this.tileWidth/2 ,row * this.tileHeight + this.tileHeight/2);
      }
      
      addTiles(){
         this.tilesLayer = this.game.add.group();
         this.tilesLayer.z = 1;
         
         for (var row: number = 0; row < GameObjects.Config.numColumns; row++) {
				for (var column: number = 0; column < GameObjects.Config.numColumns; column++) {
               if(this.level.tileAtColumn(column, row) != null){
                  var point = this.pointForColum(column, row);
                  this.tilesLayer.create(point.x, point.y, 'Tile');
               }
            }
         }
      }



   }
}