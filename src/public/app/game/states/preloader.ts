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
         
         this.game.load.image('logo', assets+'logo.png');
         this.game.load.image('bg', assets+'Background@2x.png');
         this.game.load.spritesheet("GEMS", assets+'diamonds32x5.png', 32, 32);
         
         this.game.load.image('Croissant', assets+'Croissant@2x.png');
         this.game.load.image('Cupcake', assets+'Cupcake@2x.png');
         this.game.load.image('Danish', assets+'Danish@2x.png');
         this.game.load.image('Donut', assets+'Donut@2x.png');
         this.game.load.image('Macaroon', assets+'Macaroon@2x.png');
         this.game.load.image('SugarCookie', assets+'SugarCookie@2x.png');
         
         this.game.load.image('Tile', assets+'Tile@2x.png');
         
         this.game.load.json('level0','app/game/levels/Level_0.json');
         this.game.load.json('level1','app/game/levels/Level_1.json');
         this.game.load.json('level2','app/game/levels/Level_2.json');
         this.game.load.json('level3','app/game/levels/Level_3.json');
         this.game.load.json('level4','app/game/levels/Level_4.json');
         
      }

      create() {
 
          
         //var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        // tween.onComplete.add(this.startMainMenu, this);
         this.game.state.start('GamePlay', true, false);
      }

   }
}