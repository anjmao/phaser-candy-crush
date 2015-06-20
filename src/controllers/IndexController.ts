// <reference path='../../typings/tsd.d.ts' />

import express = require('express');

interface IndexViewModel {
   channel: string;
   items: ItemViewModel[];
}
interface ItemViewModel {
   nick: string;
   date: string;
}

class IndexController {

   static index(req: express.Request, res: express.Response) {
      var model: IndexViewModel = {
         channel: 'channel name',
         items: [
            {
               nick: 'nick 222', date: 'some date'
            }
         ]
      }
      
      res.render('index', model);
   }

   static aboutUs(req: express.Request, res: express.Response) {
      res.render('about');
   }
   
   static game(req: express.Request, res: express.Response) {
      res.render('game');
   }
}

export = IndexController;