/// <reference path='../_references.ts' />

module GameApp.States {
   'use strict';

   export class Menu extends Phaser.State {

      preload() {

      }

      create() {
         
         var Croissant = this.game.add.sprite(32,100, 'Croissant');
         var Macaroon = this.game.add.sprite(32,200, 'Macaroon');
         var Cupcake = this.game.add.sprite(32,300,'Cupcake');
         
         var tweens: Phaser.Tween[] = [];
         
         var tween1 = this.game.add.tween(Croissant).to({x:200}, 1000, Phaser.Easing.Bounce.Out, false, 1000);
         var tween2 = this.game.add.tween(Macaroon).to({x:200}, 1000, Phaser.Easing.Bounce.Out, true, 200);
         var tween3 = this.game.add.tween(Cupcake).to({x:200}, 1000, Phaser.Easing.Bounce.Out, true, 100);
         
         
         tweens.push(tween1, tween2, tween3);
         
         var firstTween = tweens.shift();
         
         firstTween.chain.apply(this, tweens);
         
         firstTween.chain(tween2);
         
         firstTween.start();
         
         firstTween.onComplete.add(function() { console.log('complete'); }, this);
         firstTween.onChildComplete.add(function() { console.log('child complete'); }, this);
         
      }
      
      private tweenCroissantComplete(){
         
      }
      

   }
}