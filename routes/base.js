var express = require('express');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var Promise = require('promise');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

mongoose.Promise = Promise;

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
    if(!req.body.username || !req.body.password)
        return res.status(500);
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
    var p1 = Team.findById(req.user.favoriteTeam).exec();
    var p2 = Team.find().sort('city').exec();
    Promise.all([p1, p2])
        .then(function(results){
            var favorite = results[0];
            var teams = results[1];
            teams.unshift({_id:'', city: '', name: ''});
            return res.render('settings', {title:'Settings', team: teams, favorite: favorite});
        })
        .catch(function(err){
            console.log(err);
            return res.status(500);
        });
});

router.post('/settings', auth.isAuthenticated, function(req, res){
    User.findById(req.user._id, function(err, user){
        var promise;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        if(req.body.favoriteTeam)
            promise = Team.findOne({name: req.body.favoriteTeam}).exec();
        else
            promise = Promise.resolve();
        promise.then(function(favorite){
            user.favoriteTeam = favorite;
            return user.save();
        }).then(function(){
            return res.redirect('/settings');
        }).catch(function(err){
            console.log(err);
            return res.status(500);
        });
    });
});

module.exports = router;
