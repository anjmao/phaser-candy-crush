/// <reference path='../_references.ts' />

import GameObjects = GameApp.Models;
import Level = GameApp.Models.Level;
import Swap = GameObjects.Swap;
import IJsonLevel = GameApp.Models.IJsonLevel;
import Cookie = GameObjects.Cookie;
import GameConfig = GameApp.Models.Config;

module GameApp.States {
   'use strict';

   export class GamePlay extends Phaser.State {

      tileWidth: number = 64.0;
      tileHeight: number = 72.0;

      level: GameObjects.Level;

      cookieLayer: Phaser.Group;
      tilesLayer: Phaser.Group;

      swipeFromColumn: number;
      swipeFromRow: number;

      userInteractionEnabled: boolean;
      
      swapSound: Phaser.Sound;
      invalidSwapSound: Phaser.Sound;



      private initLevel(levelName: string) {
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         this.level = new Level();
         this.level.initWithLevel(levelData);
         this.addTiles();
      }

      create() {

         var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
         bg.anchor.setTo(0.5, 0.5);
         
         var text = this.game.add.text(64, 20, "Level 1", {
             font: "20px Arial",
             fill: "yellow",
             align: "center"
         });
         text.anchor.set(0.5, 0.5);
         
         this.swapSound = this.game.add.audio('swapSound');
         this.invalidSwapSound = this.game.add.audio('invalidSwapSound');

         this.game.input.addMoveCallback(this.touchesMoved, this);

         this.initLevel('level0');
         this.beginGame();

      }

      beginGame() {
         this.userInteractionEnabled = true;
         this.shuffle();
      }

      shuffle() {

         var cookies: Cookie[] = this.level.shuffle();
         this.addSpritesForCookies(cookies);
      }

      addSpritesForCookies(cookies: Cookie[]) {

         this.cookieLayer = this.game.add.group();
         this.cookieLayer.z = 2;

         cookies.forEach((cookie: Cookie) => {
            var point = this.pointForColum(cookie.column, cookie.row);
            var createdCookie = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
            createdCookie.inputEnabled = true;
            createdCookie.events.onInputDown.add(this.touchesBegan, this);
            createdCookie.events.onInputUp.add(this.touchesEnd, this);

            cookie.sprite = createdCookie;
         })
      }

      pointForColum(column: number, row: number): Phaser.Point {
         return new Phaser.Point(column * this.tileWidth + this.tileWidth / 2, row * this.tileHeight + this.tileHeight / 2);
      }

      convertPoint(point: Phaser.Point, cookiePosition: GameObjects.ICookiePosition): boolean {

         if (point.x >= 0 && point.x < GameConfig.numColumns * this.tileWidth &&
            point.y >= 0 && point.y < GameConfig.numRows * this.tileHeight) {

            cookiePosition.column = Phaser.Math.floor(point.x / this.tileWidth);
            cookiePosition.row = Phaser.Math.floor(point.y / this.tileHeight);

            return true;
         }
         else {
            return false;
         }

      }

      addTiles() {
         this.tilesLayer = this.game.add.group();
         this.tilesLayer.z = 1;

         for (var row: number = 0; row < GameObjects.Config.numColumns; row++) {
            for (var column: number = 0; column < GameObjects.Config.numColumns; column++) {
               if (this.level.tileAtColumn(column, row) != null) {
                  var point = this.pointForColum(column, row);
                  this.tilesLayer.create(point.x, point.y, 'Tile');
               }
               else{
                  //var point = this.pointForColum(column, row);
                  //this.tilesLayer.create(point.x, point.y, 'TileEmpty');
               }
            }
         }
      }

      touchesMoved(pointer: Phaser.Pointer, x, y, fromClick) {
         
         if (this.swipeFromColumn == null) return;
         
         if (pointer.isDown) {

            var cookiePosition: GameObjects.ICookiePosition = {
               column: null,
               row: null
            }
            //TODO: need to configure this sizes
            var pointX = x - 32,
                pointY = y - 32;
                
            if (this.convertPoint(new Phaser.Point(pointX, pointY), cookiePosition)) {

               var horzDelta: number = 0,
                  vertDelta: number = 0;

               if (cookiePosition.column < this.swipeFromColumn) { // swipe left
                  horzDelta = -1;
               } else if (cookiePosition.column > this.swipeFromColumn) { // swipe right
                  horzDelta = 1;
               } else if (cookiePosition.row < this.swipeFromRow) { // swipe down
                  vertDelta = -1;
               } else if (cookiePosition.row > this.swipeFromRow) { // swipe up
                  vertDelta = 1;
               }

               if (horzDelta != 0 || vertDelta != 0) {
                  this.trySwapHorizontal(horzDelta, vertDelta);

                  this.swipeFromColumn = null;
               }
            }
         }

      }

      touchesBegan(selectedCookie: Phaser.Sprite, pointer: Phaser.Pointer) {

         var cookiePosition: GameObjects.ICookiePosition = {
            column: null,
            row: null
         }

         if (this.convertPoint(selectedCookie.position, cookiePosition)) {
            if (this.level.cookieAtColumn(cookiePosition.column, cookiePosition.row)) {
               this.swipeFromColumn = cookiePosition.column;
               this.swipeFromRow = cookiePosition.row;
            }
            
            console.log('selectedCookie', 'column: ' + cookiePosition.column + ' row: ' + cookiePosition.row);
         }

         else {
            this.swipeFromColumn = null;
            this.swipeFromRow = null;
         }
      }

      touchesEnd(selectedCookie: Phaser.Sprite, pointer: Phaser.Pointer) {
         this.swipeFromColumn = this.swipeFromRow = null;
         //console.log('releaseCookie', selectedCookie);
         //console.log('up from', selectedGem);
         //console.log('touchesEnd pointer', pointer.position);
         
         this.userInteractionEnabled = true;
      }

      trySwapHorizontal(horzDelta: number, vertDelta: number) {

         this.userInteractionEnabled = false;

         var toColumn = this.swipeFromColumn + horzDelta;
         var toRow = this.swipeFromRow + vertDelta;

         if (toColumn < 0 || toColumn >= GameConfig.numColumns) return;
         if (toRow < 0 || toRow >= GameConfig.numRows) return;

         var toCookie: Cookie = this.level.cookieAtColumn(toColumn, toRow);
         if (!toCookie) return;

         var fromCookie = this.level.cookieAtColumn(this.swipeFromColumn, this.swipeFromRow);

         var swap = new Swap();
         swap.cookieA = fromCookie;
         swap.cookieB = toCookie;

         if (this.level.isPossibleSwap(swap)) {
            this.userInteractionEnabled = true;
            this.level.performSwap(swap);
            this.animateSwap(swap);
            console.log('Good swap');
         }
         else {
            this.userInteractionEnabled = true;
            this.animateInvalidSwap(swap);
            console.log('Bad swap');

         }

      }

      animateSwap(swap: Swap) {

         var cookieSrpiteA = swap.cookieA.sprite,
            cookieSrpiteB = swap.cookieB.sprite;

         var tween = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);
         var tween2 = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);

         tween.onComplete.add(() => {
            console.log('tween complete');
            
            this.swapSound.play();

            this.userInteractionEnabled = true;
         }, this);

      }
      
      animateInvalidSwap(swap: Swap){
          var cookieSrpiteA = swap.cookieA.sprite,
              cookieSrpiteB = swap.cookieB.sprite;  
              
          var tween = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);
          var tween2 = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);
          
          tween2.onComplete.add(() => {
             var tweenBack = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);
             var tweenBack2 = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);
             
             this.invalidSwapSound.play();
             
         }, this);
          
         
      }
      
   }
}