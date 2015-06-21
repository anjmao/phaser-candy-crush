/// <reference path='../../typings/tsd.d.ts' />
var DbConnection = require('../core/db/DbConnection');
var sequelize = require('sequelize');
var db = new DbConnection().create();
var User = db.define('User', {
    firstName: sequelize.TEXT,
    lastName: sequelize.TEXT
});
User.sync({ force: true }).then(function () {
    // Table created
    return User.create({
        firstName: 'John',
        lastName: 'Hancock'
    });
});
module.exports = User;
