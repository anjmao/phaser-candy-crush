/// <reference path='_references.ts' />
import http = require("http");
import url = require("url");
import express = require("express");
import bodyParser = require("body-parser");
//import methodOverride = require("method-override");
import errorHandler = require("errorhandler");
import path = require('path');

import routes = require('./routes');
import apiRoutes = require('./api-routes');

var app = express();

// Configuration
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join( __dirname, '/views') ); // critical to use path.join on windows
app.set('view engine', 'vash');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(methodOverride());
app.use(express.static(path.join( __dirname, '/public')));

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
app.use('/api', apiRoutes);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

export var App = app;