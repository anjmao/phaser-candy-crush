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
      enemies: Phaser.Group;
      
      
      private initLevel(levelName: string){
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         this.level = new Level();
         this.level.initWithLevel(levelData);
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
         //com
         //this.cookieLayer.position = new Phaser.Point(10,50);
         
         cookies.forEach((cookie: Cookie)=>{
            var point = this.pointForCookie(cookie.column, cookie.row);
            this.cookieLayer.create(point.x, point.y, cookie.spriteName());
         })
      }
      
      pointForCookie(column: number, row: number): Phaser.Point{
         return new Phaser.Point(column * this.tileWidth + this.tileWidth/2 ,row * this.tileHeight + this.tileHeight/2);
      }

//       createCookiesGrid() {
//          var gems = this.game.add.group();
// 
//          for (var i = 0; i < 9; i++) {
//             for (var j = 0; j < 9; j++) {
//                var gem = gems.create(i * 32, j * 32, "GEMS");
//                gem.name = 'gem' + i.toString() + 'x' + j.toString();
//                gem.inputEnabled = true;
//                // gem.events.onInputDown.add(() => {}, this);
//                // gem.events.onInputUp.add(() => {}, this);
//                this.randomizeGemColor(gem);
//                this.setGemPos(gem, i, j); // each gem has a position on the board
//             
//             }
//          }
//       }
// 
// 
//       setGemPos(gem, posX, posY) {
// 
//          gem.posX = posX;
//          gem.posY = posY;
//          gem.id = posX + posY * 9;
// 
//       }
// 
//       randomizeGemColor(gem) {
// 
//          gem.frame = this.game.rnd.integerInRange(0, gem.animations.frameTotal - 1);
// 
//       }
// 
//       moveCallback(pointer: Phaser.Pointer, x: number, y: number, fromClick) {
// 
//       }


   }
}