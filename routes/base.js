var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Box Score', user:req.user });
});

router.get('/login', function(req, res){
   res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/register', isNotAuthenticated, function(req, res){
    res.render('register', {title: 'Register'});
});

router.post('/register', isNotAuthenticated, function(req, res){
    User.register(new User({username: req.body.username, firstName:'', lastName:'', favoriteTeam:0}), req.body.password, function(err){
        if(err){
            console.log('Registration error.', err);
            return next(err);
        }
    });
    console.log('Registration successful');
    res.redirect('/login');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/settings', isAuthenticated, function(req, res){
    Team.find(function(err, teams){
        if(err)
            return res.status(500);
        User.findById(req.user._id, function(err, user){
            res.render('settings', {title:'Settings', user:user, team:teams});
        })
    });
});

router.post('/settings', isAuthenticated, function(req, res){
    User.findById(req.user._id, function(err, user){
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.favoriteTeam = req.body.favoriteTeam;
        user.save(function(err, req){
            console.log(err, req);
        });
        res.redirect('/settings');
    });
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        res.redirect('/');
    return next();
}

module.exports = router;
