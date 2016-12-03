var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

router.get('/', auth.isAuthenticated, function(req, res){
    var title = 'All Teams';
    Team.find(function(err, teams){
        if(err) {
            console.log(err);
            return res.status(500);
        }
        return res.render(path.join('team', 'index'), {title: title, team: teams});
    }).sort("city");
});

router.get('/redirect', auth.isAuthenticated, function(req, res){
    if(req.query.team)
        return res.redirect('/team/' + req.query.team);
    return res.redirect('/team');
});

module.exports = router;