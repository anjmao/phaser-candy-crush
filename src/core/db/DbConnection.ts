// <reference path='../../../typings/tsd.d.ts' />
import Sequelize = require('sequelize');

class DbConnecton {
	create() {
		var sequelize = new Sequelize('database', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			},

			// SQLite only
			storage: '../sqllite'
		});
		
		return sequelize;
	}
}

export = DbConnecton;