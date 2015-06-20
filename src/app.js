var express = require("express");
var bodyParser = require("body-parser");
//import methodOverride = require("method-override");
var errorHandler = require("errorhandler");
var path = require('path');
var routes = require('./routes');
var app = express();
// Configuration
app.set('views', path.join(__dirname, '/views')); // critical to use path.join on windows
app.set('view engine', 'vash');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/public')));
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
else if (env === 'production') {
    app.use(errorHandler());
}
// Routes
//app.get('/', routes.index);
app.use('/', routes);
app.listen(3000, function () {
    console.log("Demo Express server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.App = app;
