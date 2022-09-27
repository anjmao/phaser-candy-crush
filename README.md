# Candy crush like game made with Phaser HTML5 game engine [![kandi X-Ray](https://kandi.openweaver.com/badges/xray.svg)](https://kandi.openweaver.com/typescript/anjmao/phaser-candy-crush) [![kandi Featured](https://kandi.openweaver.com/badges/featured.svg)](https://kandi.openweaver.com/collections/gaming/candy-crush)


## About this game
One day I found very interesting blog post by [Matthijs Hollemans](http://www.raywenderlich.com/66877/how-to-make-a-game-like-candy-crush-part-1)
In this tutorial Matthijs Hollemans shows how to create Candy Crush like game in Object-C language. I readed his article and decided to rewrite this game using Phaser HTML5 game engine. I also used typescript language, because it gives a lot of advantages comparing to ES5 javascript. AngularJs is used only for creating game directive, so it can be easily included in angular app.

## Demo
You can play demo with 5 levels [here](http://candy-game.herokuapp.com/). This game is deployed to heroku using free plan so it may be not available some times.

## Environment setup
* Install NodeJs from https://nodejs.org/
* clone repository to C:\Sources (create Source folder)
```
git clone https://github.com/Anjmao/candy.git
```
* Run Npm install
```
npm install
```
* Run gulp start to start game in browser
```
gulp start
```
Recommened IDE is Visual Studio Code.

## Used technologies
* Phaser
* AngularJs
* NodeJs+ExpressJs
* Typescript

## TODO
Where is some bugs which need to be fixed and running unit tests you can notice test called <b>should fill holes after remove and get columns</b> some times fails, after fixing this test it should be fine. Also I made cookies to fall from bottom to top, this is because in objective-c arrays index is different from javascript arrays.

## Image
![Image of Game](https://github.com/Anjmao/candy/blob/github_master/heroku.png)
