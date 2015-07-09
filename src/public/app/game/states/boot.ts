/// <reference path='../_references.ts' />

module GameApp.States {
	'use strict'; 
	
   export class Boot extends Phaser.State {
 
        preload() {
 
        }
 
        create() {
 
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
 
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
 
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                //this.stage.scale.pageAlignHorizontally = true;
            }
            else {
                //  Same goes for mobile settings.
            }
 
            this.game.state.start('Preloader', true, false);
 
        }
 
    }
}