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

mongoose.Promise = global.Promise;


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
//TODO: Put secret keys in non-repo file
app.use(cookieSession({keys: ['JustinHoliday', 'SashaVujacic']}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require(path.join(__dirname, 'routes', 'base')));

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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*
console.log(nba.stats.commonTeamRoster({TeamID: "1610612738"}).then(function (obj) {
    console.log(obj)
}));
*/

//TODO: Authentication for DB, store credentials off-repo
mongoose.connect('mongodb://localhost/box-score', function(err) {
    if (err)
        console.log('Unable to connect to MongoDB.');
});

hbs.registerHelper('ifequal', function(arg1, arg2){
    console.log(arg1, arg2);
    if(arg1 == arg2)
        return 'selected';
});

module.exports = app;
