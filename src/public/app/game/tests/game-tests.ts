/// <reference path='_references.ts' />

var expect = chai.expect;

var level: GameApp.Models.Level;

describe('Level.ts', function() {

   before(function() {
      // runs before all tests in this block
   });

   after(function() {
      // runs after all tests in this block
   });

   beforeEach(function() {
      var config = new GameConfig(4,4,6);
      level = new GameApp.Models.Level(config);
     
      var data: IJsonLevel = {
         "tiles": [[1, 1, 1, 1],
                   [1, 1, 1, 1],
                   [1, 1, 1, 1],
                   [1, 1, 1, 1]],

         "targetScore": 1000,
         "moves": 15
      }

      level.initWithData(data);
      level.shuffle();
   });

   afterEach(function() {

   });

   // test cases
   it('should get shuffled cookies to be 16', (done) => {
      
      var cookies: Cookie[] = level.shuffle();
      
      expect(cookies.length).to.be.equals(16); 

      done();
   });
   
   it('should get cookie at position', (done) => {
      
      var cookies: Cookie[] = level.shuffle();
      var cookie = level.cookieAtPosition(0, 1);
      
      expect(cookie.column).to.be.equals(0); 
      expect(cookie.row).to.be.equals(1); 
      
      done();
   });
   
   it('should be not possible swap', (done) => {
      
      
      var swap = new Swap();
      swap.cookieA = new Cookie(1, 2 , 1);
      swap.cookieB = new Cookie(2 ,2, 5);
      
      expect(level.isPossibleSwap(swap)).to.be.equals(false); 

      done();
   });
   
   it('should be possible swap', (done) => {
      
      var swap = level.getPossibleSwaps()[0];
      
      expect(level.isPossibleSwap(swap)).to.be.equals(true); 

      done();
   });
   
    it('should remove matches and get chains', (done) => {
      
      var chains = removeMatchesAndGetChains();
      
      expect(chains.length).to.be.not.equals(0); 

      done();

   });
   
   it('should fill holes after remove and get columns', (done) => {
      
      var chains = removeMatchesAndGetChains();
      var columns = level.fillHoles();
      
      expect(columns.length).to.be.not.equals(0);
      
      done();
   });
   
   it('should add new cookies without empty or null slots', (done) => {
      
      var chains = removeMatchesAndGetChains();
      var columns = level.fillHoles(); 
      var newColumns = level.topUpCookies();
      
      expect(newColumns.length).to.be.not.equals(0);
      
      for (var row = 0; row < GameConfig.numRows; row++) {
				for (var column = 0; column < GameConfig.numColumns; column++) {
               var cookie = level.cookieAtPosition(column, row);
               expect(cookie).to.not.be.equals(null, 'column: '+column+' row: '+row);
            }
      }
      
      done();
   });
   
   
   
   
   //helpers
   function removeMatchesAndGetChains(): Chain[]{
      var swap = level.getPossibleSwaps()[0];
      level.performSwap(swap);
      var chains = level.removeMatches();
      
      return chains;
   }
   
   

});