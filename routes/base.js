var express = require('express');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Box Score'});
});

router.get('/login', auth.isNotAuthenticated, function(req, res){
   res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/register', auth.isNotAuthenticated, function(req, res){
    res.render('register', {title: 'Register'});
});

router.post('/register', auth.isNotAuthenticated, function(req, res, next){
    User.register(new User({username: req.body.username, firstName:'', lastName:'', favoriteTeam:null}), req.body.password, function(err){
        if(err){
            console.log('Registration error.', err);
            return res.status(500);
        }
    });
    console.log('Registration successful');
    res.redirect('/login');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/settings', auth.isAuthenticated, function(req, res){
    Team.find(function(err, teams){
        if(err) {
            console.log(err);
            return res.status(500);
        }
        User.findById(req.user._id, function(err, user){
            res.render('settings', {title:'Settings', team:teams});
        });
    });
});

router.post('/settings', auth.isAuthenticated, function(req, res){
    User.findById(req.user._id, function(err, user){
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.favoriteTeam = mongoose.Types.ObjectId(req.body.favoriteTeam);
        user.save(function(err){
            if(err){
                console.log(err);
                return res.status(500);
            }
        });
        res.redirect('/settings');
    });
});

module.exports = router;
