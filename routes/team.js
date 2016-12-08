var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require('promise');
mongoose.Promise = Promise;
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

router.use(auth.isAuthenticated);

router.get('/', function (req, res) {
    var title = 'All Teams';
    Team.find(function (err, teams) {
        if (err) {
            console.log(err);
            return res.status(500);
        }
        return res.render(path.join('team', 'index'), {title: title, team: teams});
    }).sort("city");
});

router.get('/redirect', function (req, res) {
    if (req.query.team)
        return res.redirect('/team/' + req.query.team);
    return res.redirect('/team');
});

router.get('/:team', function (req, res) {
    Team.findOne({name: req.params.team}, function (err, team) {
        if (err)
            return res.status(500);
        var title = team.city + ' ' + team.name;
        Player.find({_id: {$in: team.players}}).exec()
            .then(function(players){
                return res.render(path.join('team', 'team'), {title: title, team: team, player: players});
            });
        /*Promise.all(team.players)
            .then(function () {
                return res.render(path.join('team', 'team'), {title: title, team: team});
            });*/
        /*Player.find({_id: {$in: team.players}}, function(players){
         return res.render(path.join('team', 'team'), {title: title, team: team, player: players});
         });*/
    })
});

module.exports = router;