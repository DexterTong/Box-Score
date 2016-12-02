var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

//Search for users
router.get('/', auth.isAuthenticated, function(req, res){
    var title;
    if(req.query.username) {
        title = 'Results for \'' + req.query.username + '\'';
        User.find({username: {"$regex": req.query.username, "$options": "i" }}, function(err, users){
           if(err) {
               console.log(err);
               return res.status(500);
           }
           return res.render(path.join('user', 'index'), {title: title, user: users});
        });
    }
    else {
        title = 'User Search';
        return res.render(path.join('user', 'index'), {title: title});
    }
});

//TODO: display user info, bets, etc
//TODO: handle case when user data fields such as fav team are undefined
router.get('/:user', auth.isAuthenticated, function(req, res){
    User.findOne({username: req.params.user}, function(err, user){
        if(err) {
            console.log(err);
            return res.status(500);
        }
        if(!user) {
            // user requested DNE
            return res.redirect('/');
        }
        Team.findById(user.favoriteTeam, function(err, team){
            if(err) {
                console.log(err);
                return res.status(500);
            }
            var teamName;
            if(team)
                teamName = team.city + ' ' + team.name;
            var title = user.username + '\'s page';
            return res.render(path.join('user', 'user'), {user: user, teamName: teamName, title: title});
        });
    });
});

module.exports = router;