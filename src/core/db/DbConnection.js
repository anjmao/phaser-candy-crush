// <reference path='../../../typings/tsd.d.ts' />
var Sequelize = require('sequelize');
var DbConnecton = (function () {
    function DbConnecton() {
    }
    DbConnecton.prototype.create = function () {
        var sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            // SQLite only
            storage: 'sqllite'
        });
        return sequelize;
    };
    return DbConnecton;
})();
module.exports = DbConnecton;
