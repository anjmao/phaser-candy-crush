/// <reference path='../_references.ts' />

import GameObjects = GameApp.Objects;
import Level = GameApp.Objects.Level;
import IJsonLevel = GameApp.Objects.IJsonLevel;
import Cookie = GameObjects.Cookie;
import GameConfig = GameApp.Objects.Config;

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

      selectedCookie: Cookie = null;


      private initLevel(levelName: string) {
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         this.level = new Level();
         this.level.initWithLevel(levelData);
         this.addTiles();
      }

      create() {

         var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
         bg.anchor.setTo(0.5, 0.5);

         this.game.input.addMoveCallback(this.touchesMoved, this);

         this.initLevel('level1');
         this.beginGame();

      }

      beginGame() {
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
            createdCookie.column = cookie.column;
            createdCookie.row = cookie.row;
            createdCookie.inputEnabled = true;
            createdCookie.events.onInputDown.add(this.touchesBegan, this);
            createdCookie.events.onInputUp.add(this.touchesEnd, this);
         })
      }

      pointForColum(column: number, row: number): Phaser.Point {
         return new Phaser.Point(column * this.tileWidth + this.tileWidth / 2, row * this.tileHeight + this.tileHeight / 2);
      }

      convertPoint(point: Phaser.Point, cookiePosition: GameObjects.ICookiePosition): boolean {

         if (point.x >= 0 && point.x < GameConfig.numColumns * this.tileWidth &&
            point.y >= 0 && point.y < GameConfig.numRows * this.tileHeight) {

            cookiePosition.column = Math.floor(point.x / this.tileWidth);
            cookiePosition.row = Math.floor(point.y / this.tileHeight);

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
            }
         }
      }

      touchesMoved(pointer, x, y, fromClick) {
         
         if(!this.swipeFromColumn) return;
         
         if (pointer.isDown) {

            var cookiePosition: GameObjects.ICookiePosition = {
               column: null,
               row: null
            }

            if (this.convertPoint(new Phaser.Point(x, y), cookiePosition)) {

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

      touchesBegan(selectedCookie, pointer) {

         if (this.level.cookieAtColumn(selectedCookie.column, selectedCookie.row)) {
            this.swipeFromColumn = selectedCookie.column;
            this.swipeFromRow = selectedCookie.row;
            //console.log('col data', this.columnForPoint(selectedCookie.position));
            console.log('selectCookie col', selectedCookie.column);
            console.log('selectCookie row', selectedCookie.row);
         }
         else{
            this.swipeFromColumn = null;
            this.swipeFromRow = null;
         }

      }

      touchesEnd(selectedCookie) {
         this.swipeFromColumn = this.swipeFromRow = null;
         //console.log('releaseCookie', selectedCookie);
         //console.log('up from', selectedGem);
      }
      
      trySwapHorizontal(horzDelta: number, vertDelta: number){
         var toColumn = this.swipeFromColumn + horzDelta;
         var toRow = this.swipeFromRow + vertDelta;
         
         if (toColumn < 0 || toColumn >= GameConfig.numColumns) return;
         if (toRow < 0 || toRow >= GameConfig.numRows) return;
         
         var toCookie: Cookie = this.level.cookieAtColumn(toColumn, toRow);
         if(!toCookie) return;
         
         var fromCookie = this.level.cookieAtColumn(this.swipeFromColumn, this.swipeFromRow);
         
         console.log('fromCookie', fromCookie);
         console.log('toCookie', toCookie);
         
         
      }

   }
}