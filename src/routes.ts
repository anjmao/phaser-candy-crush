/// <reference path='_references.ts' />

import express = require('express');
import IndexController = require('./controllers/index-controller')
var router = express.Router();

/* GET home page. */
router.get('/', IndexController.index);
router.get('/about', IndexController.aboutUs);
router.post('/game', IndexController.game);

export = router;