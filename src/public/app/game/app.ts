/// <reference path='../../libs/phaser/typescript/phaser.d.ts' />
class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(1155, 558, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('logo', 'app/game/assets/logo.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
}


window.onload = () => {

    //var game = new SimpleGame();

};