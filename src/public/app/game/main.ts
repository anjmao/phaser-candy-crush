/// <reference path='_references.ts' />

class CandyGame{
	constructor(scope: ng.IScope, injector) {
        this.game = new Phaser.Game(640, 1136, Phaser.AUTO, 'gameCanvas', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('logo', 'app/game/assets/logo.png');
        this.game.load.image('bg','app/game/assets/Background@2x.png')
    }

    create() {
        var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        
        this.game.input.addMoveCallback(this.moveCallback, this);
    }
    
    moveCallback(pointer: Phaser.Pointer, x:number, y:number, fromClick){
       
    }
}