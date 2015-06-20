/// <reference path='_references.ts' />
var express = require('express');
var IndexController = require('./controllers/IndexController');
var router = express.Router();
/* GET home page. */
router.get('/', IndexController.index);
router.get('/about', IndexController.aboutUs);
router.get('/game', IndexController.game);
module.exports = router;
