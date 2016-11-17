var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', username: req.user.username });
});

router.get('/login', function(req, res){
   res.render('login', {title: 'Login', username: req.user.username });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/register', function(req, res){
    res.render('register', {title: 'Register', username: req.user.username });
});

router.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err){
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

module.exports = router;
