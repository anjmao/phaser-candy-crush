module GameApp.States{
	'use strict';
	
	export class GameTimer{
		
		game: Phaser.Game;
      
      timer: Phaser.Timer;
      timerEvent: Phaser.TimerEvent;
      timerText: Phaser.Text;
		
		constructor(game: Phaser.Game) {
			this.game = game;
		}
		
		renderTimer() {
         if(this.timer.running){
            this.timerText.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000))
         }
         else{
            this.timerText.text = "Done";
         }
      }
      
      createTimer() {
         
         var timerlabel = this.game.add.text(32, 20, "Time:", {
            font: "Gill Sans Bold",
            fill: "white",
            align: "center",
            fontSize: 20
         });
         timerlabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);

         this.timerText = this.game.add.text(32, 40, "02:00", {
             font: "Gill Sans Bold",
             fill: "white",
             align: "center",
             fontSize: 30
         });
         this.timerText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         this.timer = this.game.time.create();
         this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 30, this.endTimer, this);
         this.timer.start();
      }
      
      endTimer(){
         this.timer.stop();
         
         var levelNumber = parseInt(this.game.state.states['GameScene'].levelNumber);
         if(levelNumber <= 2){
             levelNumber = levelNumber+1;
             
             
              var bg = this.game.add.sprite(this.game.world.centerX, -200, 'levelComplete');
              bg.anchor.setTo(0.5, 0.5);

              
              var tween = this.game.add.tween(bg).to({ x: this.game.world.centerX, y: this.game.world.centerY }, 3000, Phaser.Easing.Bounce.Out, true);
              
              tween.onComplete.add(() => {
                 this.changeLevel(levelNumber);
              }, this)
             
             
         }
         else{
            this.timerText.text = "Game over";
         }
        
      }
      
      changeLevel(levelNumber: number){
         this.game.state.states['GameScene'].levelNumber = levelNumber;
         this.game.state.states['GameScene'].score = this.game.state.states['GameScene'].score;
         this.game.state.start('GameScene', true, false);
      }
      
      formatTime(s: number){
         var minutes: any = "0" + Math.floor(s / 60);
         var seconds = "0" + (s - minutes * 60);
         return minutes.substr(-2) + ":" + seconds.substr(-2); 
      }
		
	}
	
}