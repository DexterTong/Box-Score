var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieSession = require('cookie-session');
var nba = require('nba');
var hbs = require('hbs');
var fs = require('fs');
var Promise = require('promise');
var cookieSessionOptions = require(path.join(__dirname, 'middleware', 'cookieSessionOptions'));
var thisUser = require(path.join(__dirname, 'middleware', 'thisUser'));

require(path.join(__dirname, 'db'));
require(path.join(__dirname, 'helpers', 'handlebarHelpers'));

mongoose.Promise = Promise;
//mongoose.set('debug', true);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession(cookieSessionOptions.cookieSessionOptions()));
app.use(passport.initialize());
app.use(passport.session());
app.use(thisUser.thisUser);

app.use('/', require(path.join(__dirname, 'routes', 'base')));
app.use('/admin', require(path.join(__dirname, 'routes', 'admin')));
app.use('/user', require(path.join(__dirname, 'routes', 'user')));
app.use('/team', require(path.join(__dirname, 'routes', 'team')));
app.use('/game', require(path.join(__dirname, 'routes', 'game')));

var User = require(path.join(__dirname, 'models', 'user'));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (process.env.NODE_ENV === 'PRODUCTION_A' || process.env.NODE_ENV === 'PRODUCTION_B') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
else
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });


module.exports = app;
