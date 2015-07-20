/// <reference path='../_references.ts' />

import GameObjects = GameApp.Models;

import Level = GameObjects.Level;
import Swap = GameObjects.Swap;
import IJsonLevel = GameObjects.IJsonLevel;
import Cookie = GameObjects.Cookie;
import Chain = GameObjects.Chain;
import GameConfig = GameObjects.Config;

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
      
      isPossibleSwap:boolean = false;
      userInteractionEnabled: boolean;

      swapSound: Phaser.Sound;
      invalidSwapSound: Phaser.Sound;
      matchSound: Phaser.Sound;
      fallingCookieSound: Phaser.Sound;
      addCookieSound: Phaser.Sound;
      
      gameTimer: GameTimer;


      private initLevel(levelName: string) {
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         
         if(levelData == null)
         {
            throw 'Cannot load level data';
         }
         
         var gameConfig = new GameConfig(9, 9, 6);
         this.level = new Level(gameConfig);
         this.level.initWithData(levelData);
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
         this.matchSound = this.game.add.audio('matchSound');
         this.fallingCookieSound = this.game.add.audio('fallingCookieSound');
         this.addCookieSound = this.game.add.audio('addCookieSound');
         
         this.gameTimer = new GameTimer(this.game);
         this.gameTimer.createTimer();

         this.game.input.addMoveCallback(this.touchesMoved, this);

         this.initLevel('level1');
         this.beginGame();

      }

      render() {
         this.gameTimer.renderTimer();
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

         if (point.x >= 0 && point.x < this.level.config.numColumns * this.tileWidth &&
            point.y >= 0 && point.y < this.level.config.numRows * this.tileHeight) {

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

         for (var row: number = 0; row < this.level.config.numColumns; row++) {
            for (var column: number = 0; column < this.level.config.numColumns; column++) {
               if (this.level.tileAtColumn(column, row) != null) {
                  var point = this.pointForColum(column, row);
                  this.tilesLayer.create(point.x, point.y, 'Tile');
               }
            }
         }
      }
      
      debugMove(x, y){
         var cookiePosition: GameObjects.ICookiePosition = {
               column: null,
               row: null
         }
         var convert = this.convertPoint(new Phaser.Point(x-32, y-32), cookiePosition);
         
         if(convert){
            var cookie = this.level.cookieAtPosition(cookiePosition.column, cookiePosition.row);
            if(cookie){
               console.log('actual cookie', {
               column: cookie.column,
               row: cookie.row
            })
            }
            
         }
        
         console.log('cookie point', cookiePosition);
      }
      touchesMoved(pointer: Phaser.Pointer, x, y, fromClick) {
         
         this.debugMove(x, y);
         
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
            if (this.level.cookieAtPosition(cookiePosition.column, cookiePosition.row)) {
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
         
         if(this.isPossibleSwap){
            this.handleMatches();
         }
         
         
         this.userInteractionEnabled = true;
      }
      
      trySwapHorizontal(horzDelta: number, vertDelta: number) {

         this.userInteractionEnabled = false;

         var toColumn = this.swipeFromColumn + horzDelta;
         var toRow = this.swipeFromRow + vertDelta;

         if (toColumn < 0 || toColumn >= this.level.config.numColumns) return;
         if (toRow < 0 || toRow >= this.level.config.numRows) return;

         var toCookie: Cookie = this.level.cookieAtPosition(toColumn, toRow);
         if (!toCookie) return;

         var fromCookie = this.level.cookieAtPosition(this.swipeFromColumn, this.swipeFromRow);

         var swap = new Swap();
         swap.cookieA = fromCookie;
         swap.cookieB = toCookie;

         if (this.level.isPossibleSwap(swap)) {
            this.userInteractionEnabled = true;
            this.level.performSwap(swap);
            this.animateSwap(swap);
            this.isPossibleSwap = true;
            console.log('Good swap');
         }
         else {
            this.userInteractionEnabled = true;
            this.animateInvalidSwap(swap);
            this.isPossibleSwap = false;
            console.log('Bad swap');

         }

      }

      handleMatches() {
         var chains = this.level.removeMatches();
         if(chains.length == 0){
            this.beginNextTurn();
            return;
         }
         
         this.animateMatchedCookies(chains);
         var columns = this.level.fillHoles();
         this.animateFallingCookies(columns);
         
         var newColumns = this.level.topUpCookies();
         
         this.animateNewCookies(newColumns, () => {
            this.handleMatches();
         });

      }
      
      private beginNextTurn(){
         this.userInteractionEnabled = true;
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

      animateInvalidSwap(swap: Swap) {
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

      animateMatchedCookies(chains: Chain[]) {

         chains.forEach((chain) => {
            chain.cookies.forEach((cookie) => {
               // 1
               if (cookie.sprite != null) {
 
                  // 2
                  cookie.sprite.kill();
                  this.matchSound.play();
                  
 
                  // 3
                  cookie.sprite = null;
               }
            });
         });

      }
      
      animateFallingCookies(columns: any[]){
         
         var longestDuration = 0;
         
         columns.forEach((cookies: Cookie[]) => {
            var count = 0;
            cookies.forEach((cookie: Cookie) => {
               count++;
               
               var newPosition = this.pointForColum(cookie.column, cookie.row);
               
               var delay = 0.05 + 0.15 * count*500;
               
               var duration = ((cookie.sprite.position.y - newPosition.y) / this.tileHeight) * 100;
               
               longestDuration = Math.max(longestDuration, duration + delay);
               
               var tween = this.game.add.tween(cookie.sprite).to({ x: newPosition.x, y: newPosition.y }, duration, Phaser.Easing.Linear.None, true, delay);
               
               tween.onComplete.add(() => {
                  console.log('animateFallingCookies complete', duration);
                  this.fallingCookieSound.play();
               });
               
            });
         });
         
      }
      
      
      animateNewCookies(columns: any[], onComplete){
         
         var longestDuration = 0;
         var tweens: Phaser.Tween[] = [];
         
         columns.forEach((cookies: Cookie[]) => {
            var idx = 0;
            
            var startRow = cookies[0].row + 1;
            var cookiesCount = cookies.length;
            
            cookies.forEach((cookie: Cookie) => {
               idx++;
               
               var point = this.pointForColum(cookie.column, startRow);
               var createdCookie: Phaser.Sprite = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
               createdCookie.inputEnabled = true;
               createdCookie.events.onInputDown.add(this.touchesBegan, this);
               createdCookie.events.onInputUp.add(this.touchesEnd, this);
               cookie.sprite = createdCookie;
               
               var delay = 0.1 + 0.2 * (cookiesCount - idx - 1) * 500;
               
               var duration = (startRow - cookie.row) * 100;
               longestDuration = Math.max(longestDuration, duration + delay);
               
               var newPoint = this.pointForColum(cookie.column, cookie.row);
               createdCookie.alpha = 0;
               
               var tween = this.game.add.tween(createdCookie).to({ x: newPoint.x, y: newPoint.y, alpha: 1 }, duration, Phaser.Easing.Linear.None, true, delay);
               
            });
            
         });
         
         this.game.time.events.add(longestDuration+1000, onComplete, this);
      }  

   }
}