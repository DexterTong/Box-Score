var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
   res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/register', function(req, res){
    res.render('register', {title: 'Register'});
});

router.post('/register', function(req, res){
    console.log(req.body);
    res.redirect('/login');
});

module.exports = router;
