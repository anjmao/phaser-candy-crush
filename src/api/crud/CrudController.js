/// <reference path='../../../typings/tsd.d.ts' />
var UserModel = require('../../models/UserModel');
var CrudController = (function () {
    function CrudController() {
    }
    CrudController.createUser = function (req, res) {
        UserModel.create(req.body).then(function () {
            res.json(req.body);
        });
    };
    CrudController.getUsers = function (req, res) {
        UserModel.findAll().then(function (users) {
            res.json(users);
        });
    };
    CrudController.deleteUser = function (req, res) {
        UserModel.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.json(req.params);
        });
    };
    return CrudController;
})();
module.exports = CrudController;
