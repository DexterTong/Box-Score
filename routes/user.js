var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var helper = require(path.join(__dirname, '..', 'helpers', 'routeHelpers'));

//TODO: display user info, bets, etc
router.get('/:user', function(req, res){
    User.findOne({username: req.params.user}, function(err, userFound){
        if(err) {
            console.log('err');
            return res.status(500);
        }
        return res.render(path.join('user', 'user'), {userFound: userFound});
    });
});

module.exports = router;