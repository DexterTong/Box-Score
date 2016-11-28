var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var helper = require(path.join(__dirname, '..', 'helpers', 'routeHelpers'));

//TODO: display user info, bets, etc
router.get('/:user', function(req, res){
    User.findOne({username: req.params.user}, function(err, user){
        if(err)
            return res.status(500);
        Team.findById(user.favoriteTeam, function(err, team){
            if(err)
                return res.status(500);
            var title = 'This is the userpage of ' + user.username;
            return res.render(path.join('user', 'user'), {user: user, teamName: team.fullName, title: title});
        });
    });
});

module.exports = router;