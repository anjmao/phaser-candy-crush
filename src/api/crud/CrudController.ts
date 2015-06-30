/// <reference path='../../../typings/tsd.d.ts' />

import express = require('express');
import UserModel = require('../../models/UserModel');


class CrudController {
	static createUser(req: express.Request, res: express.Response) {
		UserModel.create(req.body).then(() => {
			res.json(req.body);
		});
	}

	static getUsers(req: express.Request, res: express.Response) {
		UserModel.findAll().then((users) => {
			res.json(users);
		})
	}

	static deleteUser(req: express.Request, res: express.Response) {
		UserModel.destroy({
			where: {
				id: req.params.id
			}
		}).then(() => {
			res.json(req.params);
		});
	}
}

export = CrudController;