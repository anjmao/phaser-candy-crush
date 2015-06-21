var IndexController = (function () {
    function IndexController() {
    }
    IndexController.index = function (req, res) {
        var model = {
            channel: 'channel name',
            items: [
                {
                    nick: 'nick 222',
                    date: 'some date'
                }
            ]
        };
        res.render('index', model);
    };
    IndexController.aboutUs = function (req, res) {
        res.render('about');
    };
    IndexController.game = function (req, res) {
        res.render('game');
    };
    return IndexController;
})();
module.exports = IndexController;
