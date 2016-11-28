var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var helper = require(path.join(__dirname, 'routeHelpers'));

//TODO: display user info, bets, etc
router.get('/:user', function(req, res){
    console.log(req.params);
    res.send('you are at the page of ' + req.params.user);
});

module.exports = router;