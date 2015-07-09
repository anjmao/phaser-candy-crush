/// <reference path='../_references.ts' />

module GameApp.States {
   'use strict';

   export class Preloader extends Phaser.State {

      preload() {
         
         var assets = 'app/game/assets/';
         
         this.game.load.image('logo', assets+'logo.png');
         this.game.load.image('bg', assets+'Background@2x.png');
         this.game.load.spritesheet("GEMS", assets+'diamonds32x5.png', 32, 32);
         
         this.game.load.image('Croissant', assets+'Croissant.png');
         this.game.load.image('Cupcake', assets+'Cupcake.png');
         this.game.load.image('Danish', assets+'Danish.png');
         this.game.load.image('Donut', assets+'Donut.png');
         this.game.load.image('Macaroon', assets+'Macaroon.png');
         this.game.load.image('SugarCookie', assets+'SugarCookie.png');
      }

      create() {

         //var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
         //tween.onComplete.add(this.startMainMenu, this);
         this.game.state.start('GamePlay', true, false);
      }

   }
}