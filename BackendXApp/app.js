var mongoose = require('./models/database.js')

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));


// Allow all requests from other domains
// This should be changed to allow access to parts of the system only.
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// Actual content / resources
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


/******************
 * Error handling *
 ******************/


/**
 * Catch 404
 */
app.use(function (req, res, next) {
    var err = new Error('Not found.');
    err.status = 404;
    next(err);
});


/**
 * Development error handler.
 */
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}


/**
 * Production error handler.
 */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(
        {
            message: err.message, 
            error: {}
        }
    );
});


module.exports = app;
