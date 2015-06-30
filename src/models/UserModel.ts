/// <reference path='../../typings/tsd.d.ts' />

import DbConnection = require('../core/db/DbConnection')
import sequelize = require('sequelize');

var db = new DbConnection().create();

var User = db.define('User', {
  firstName: sequelize.TEXT,
  lastName: sequelize.TEXT
})

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});


export = User;