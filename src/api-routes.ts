/// <reference path='_references.ts' />

import express = require('express');
import CrudController = require('./api/crud/CrudController')
var router = express.Router();

/* GET home page. */
router.get('/getUsers', CrudController.getUsers);
router.post('/createUser', CrudController.createUser);
router.delete('/deleteUser', CrudController.deleteUser);

export = router;