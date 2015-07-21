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

   export class GameScene extends Phaser.State {

      tileWidth: number = 64.0;
      tileHeight: number = 72.0;
      marginYDelta: number = 50;

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
      
      score: number;
      scoreText: Phaser.Text;
      scoreLabel: Phaser.Text;

      create() {

         var levelNumber: number = this.game.state.states['GameScene'].levelNumber;

         var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
         bg.anchor.setTo(0.5, 0.5);

         this.game.sound.play('bgMusic');
         
         this.createLevelText(levelNumber + 1);
         
         this.initScore();
         this.createScoreText();
         

         this.swapSound = this.game.add.audio('swapSound');
         this.invalidSwapSound = this.game.add.audio('invalidSwapSound');
         this.matchSound = this.game.add.audio('matchSound');
         this.fallingCookieSound = this.game.add.audio('fallingCookieSound');
         this.addCookieSound = this.game.add.audio('addCookieSound');
         
         this.gameTimer = new GameTimer(this.game);
         this.gameTimer.createTimer();

         this.game.input.addMoveCallback(this.touchesMoved, this);
         
         
         this.initLevel('level'+levelNumber);
         this.beginGame();

      }
      
      private initScore() {
         var scoreFromState = this.game.state.states['GameScene'].score;
         if(scoreFromState != null){
            this.score =  scoreFromState;
         }
         else{
            this.score =  0;
         }
      }
      
      private createLevelText(levelNumber){
         var levelLabel = this.game.add.text(550, 20, "Level:", {
            font: "Gill Sans Bold",
            fill: "white",
            align: "center",
            fontSize: 20
         });
         levelLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         var levelText = this.game.add.text(550, 40, ""+levelNumber, {
            font: "Gill Sans Bold",
            fill: "white",
            align: "center",
            fontSize: 30
         });
         levelText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
      }
      
      private createScoreText(){
         this.scoreLabel = this.game.add.text(this.game.world.centerX, 20 , "Score:" , {
            font: "Gill Sans Bold",
            fill: "white",
            fontSize: 20
         });
         this.scoreLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         
         this.scoreText = this.game.add.text(this.game.world.centerX, 40 , ""+this.score , {
            font: "Gill Sans Bold",
            fill: "white",
            fontSize: 30
         });
         this.scoreText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
      }
      
      private updateScoreText(){
         this.scoreText.text = ""+this.score;
      }

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
            var point = this.pointForCookie(cookie.column, cookie.row);
            var createdCookie = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
            createdCookie.inputEnabled = true;
            createdCookie.events.onInputDown.add(this.touchesBegan, this);
            createdCookie.events.onInputUp.add(this.touchesEnd, this);
            cookie.sprite = createdCookie;
         })
      }

      pointForCookie(column: number, row: number): Phaser.Point {
         var x = column * this.tileWidth + this.tileWidth / 2;
         var y = (row * this.tileHeight + this.tileHeight / 2) + this.marginYDelta;
         
         return new Phaser.Point(x, y);
      }

      convertPoint(point: Phaser.Point, cookiePosition: GameObjects.ICookiePosition): boolean {

         var x = point.x - 32;
         var y = point.y - 32 - this.marginYDelta;
         
         if (x >= 0 && x < this.level.config.numColumns * this.tileWidth &&
            y >= 0 && y < this.level.config.numRows * this.tileHeight) {

            cookiePosition.column = Phaser.Math.floor(x / this.tileWidth);
            cookiePosition.row = Phaser.Math.floor((y) / this.tileHeight);

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
                  var point = this.pointForCookie(column, row);
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
         var convert = this.convertPoint(new Phaser.Point(x, y), cookiePosition);
         
         if(convert){
            var cookie = this.level.cookieAtPosition(cookiePosition.column, cookiePosition.row);
            if(cookie){
               console.log('actual cookie', {
               column: cookie.column,
               row: cookie.row
            })
            }
            
         }
        console.log('x-'+x+' y-'+y);
         //console.log('cookie point', cookiePosition);
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
         this.updateScore(chains);
         
         var columns = this.level.fillHoles();
         this.animateFallingCookies(columns);
         
         var newColumns = this.level.topUpCookies();
         
         this.animateNewCookies(newColumns, () => {
            this.handleMatches();
         });

      }
      
      private updateScore(chains: Chain[]){
         chains.forEach((chain) => {
            this.score += chain.score;   
         });
         
         this.updateScoreText();
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
            
            this.animateScoreForChain(chain);
            
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
               
               var newPosition = this.pointForCookie(cookie.column, cookie.row);
               
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
               
               var point = this.pointForCookie(cookie.column, startRow);
               var createdCookie: Phaser.Sprite = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
               createdCookie.inputEnabled = true;
               createdCookie.events.onInputDown.add(this.touchesBegan, this);
               createdCookie.events.onInputUp.add(this.touchesEnd, this);
               cookie.sprite = createdCookie;
               
               var delay = 0.1 + 0.2 * (cookiesCount - idx - 1) * 150;
               
               var duration = (startRow - cookie.row) * 100;
               longestDuration = Math.max(longestDuration, duration + delay);
               
               var newPoint = this.pointForCookie(cookie.column, cookie.row);
               createdCookie.alpha = 0;
               
               var tween = this.game.add.tween(createdCookie).to({ x: newPoint.x, y: newPoint.y, alpha: 1 }, duration, Phaser.Easing.Linear.None, true, delay);
               
            });
            
         });
         
         this.game.time.events.add(longestDuration+100, onComplete, this);
      }  
      
      animateScoreForChain(chain: Chain){
         var firstCookie = chain.cookies[0];
         var lastCookie = chain.cookies[chain.cookies.length - 1];
         
         var x = (firstCookie.sprite.position.x + lastCookie.sprite.position.x + 30)/2;
         var y = (firstCookie.sprite.position.y + lastCookie.sprite.position.y)/2 - 8;
         
         var scoreLabel = this.game.add.text(x, y, ""+chain.score, {
            font: "Gill Sans Bold",
            fill: "white",
            align: "center",
            fontSize: 30
         });
         scoreLabel.z = 300;
         
         this.game.add.tween(scoreLabel).to({ alpha: 0 }, 700, Phaser.Easing.Linear.None, true);
      }

   }
}