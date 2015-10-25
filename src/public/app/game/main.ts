/// <reference path='_references.ts' />

import Boot = GameApp.States.Boot;
import Preloader = GameApp.States.Preloader;
import GameScene = GameApp.States.GameScene;
import GameEnd = GameApp.States.GameEnd;
import Menu = GameApp.States.Menu;

class CandyGame {
   constructor(scope, injector) {
      this.game = new Phaser.Game(640, 1136, Phaser.AUTO, 'gameCanvas', {
         create: this.create
      });

   }

   game: Phaser.Game;

   create() {
      this.game.state.add("Boot", Boot);
      this.game.state.add("Preloader", Preloader);
      this.game.state.add("Menu", Menu);
      this.game.state.add("GameScene", GameScene);
      this.game.state.add("GameEnd", GameEnd);
      
      this.game.state.start("Boot");
   }

}
