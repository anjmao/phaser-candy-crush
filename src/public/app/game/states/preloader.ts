/// <reference path='../_references.ts' />

module GameApp.States {
   'use strict';

   export class Preloader extends Phaser.State {

      preload() {
         
         var assets = 'app/game/assets/';
         
         var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Loading...", {
             font: "65px Arial",
             fill: "#ff0044",
             align: "center"
         });

         text.anchor.set(0.5, 0.5);
         
         this.game.load.image('logo', assets+'logo.png');//TODO: remove not used assets
         this.game.load.image('bg', assets+'Background@2x.png');
         this.game.load.image('levelComplete', assets+'LevelComplete@2x.png');
         
         this.game.load.spritesheet("GEMS", assets+'diamonds32x5.png', 32, 32);
         
         this.game.load.image('Croissant', assets+'Croissant@2x.png');
         this.game.load.image('Cupcake', assets+'Cupcake@2x.png');
         this.game.load.image('Danish', assets+'Danish@2x.png');
         this.game.load.image('Donut', assets+'Donut@2x.png');
         this.game.load.image('Macaroon', assets+'Macaroon@2x.png');
         this.game.load.image('SugarCookie', assets+'SugarCookie@2x.png');
         
         
         this.game.load.image('Tile', assets+'Tile@2x.png');
         this.game.load.image('TileEmpty', assets+'TileEmpty.png')
         
         this.game.load.json('level0', assets+'levels/Level_0.json');
         this.game.load.json('level1', assets+'levels/Level_1.json');
         this.game.load.json('level2', assets+'levels/Level_2.json');
         this.game.load.json('level3', assets+'levels/Level_3.json');
         this.game.load.json('level4', assets+'levels/Level_4.json');
         this.game.load.json('level5', assets+'levels/Level_5.json');
         
         this.game.load.audio('swapSound', assets+'sounds/Chomp.wav');
         this.game.load.audio('invalidSwapSound', assets+'sounds/Error.wav');
         this.game.load.audio('matchSound', assets+'sounds/Ka-Ching.wav');
         this.game.load.audio('fallingCookieSound', assets+'sounds/Scrape.wav');
         this.game.load.audio('addCookieSound', assets+'sounds/Drip.wav');
         this.game.load.audio('bgMusic', assets+'sounds/mining-by-moonlight.mp3');
      }

      create() {
 
         this.game.state.states['GameScene'].levelNumber = 0;
         this.game.state.start('GameScene', true, false);
      }

   }
}