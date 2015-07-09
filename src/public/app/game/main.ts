/// <reference path='_references.ts' />

class CandyGame {
   constructor(scope: ng.IScope, injector) {
      this.game = new Phaser.Game(640, 1136, Phaser.AUTO, 'gameCanvas', { 
         preload: this.preload.bind(this), 
         create: this.create.bind(this) 
      });
   }

   game: Phaser.Game;

   tileWidth: number = 32.0;
   tileHeight: number = 36.0

   preload() {
      this.game.load.image('logo', 'app/game/assets/logo.png');
      this.game.load.image('bg', 'app/game/assets/Background@2x.png');
      this.game.load.spritesheet("GEMS", "app/game/assets/diamonds32x5.png", 32, 32);
   }

   create() {
      var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
      bg.anchor.setTo(0.5, 0.5);
      
      this.createCookiesGrid();
      //this.game.input.addMoveCallback(this.moveCallback, this);
   }
   
   
    createCookiesGrid() {
      var gems = this.game.add.group();
      

      for (var i = 0; i < 9; i++) {
         for (var j = 0; j < 9; j++) {
            var gem = gems.create(i * this.tileWidth, j * this.tileWidth, "GEMS");
            gem.name = 'gem' + i.toString() + 'x' + j.toString();
            gem.inputEnabled = true;
            // gem.events.onInputDown.add(() => {}, this);
            // gem.events.onInputUp.add(() => {}, this);
            this.randomizeGemColor(gem);
            this.setGemPos(gem, i, j); // each gem has a position on the board
            
         }
      }
   }
   

   setGemPos(gem, posX, posY) {

      gem.posX = posX;
      gem.posY = posY;
      gem.id = posX + posY * 9;

   }

   randomizeGemColor(gem) {

      gem.frame = this.game.rnd.integerInRange(0, gem.animations.frameTotal - 1);

   }

   moveCallback(pointer: Phaser.Pointer, x: number, y: number, fromClick) {

   }
}
