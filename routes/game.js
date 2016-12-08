var express = require('express');
var passport = require('passport');
var nba = require('nba');
var path = require('path');
var Promise = require('promise');
var router = express.Router();
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Game = require(path.join(__dirname, '..', 'models', 'game'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));

router.use(auth.isAuthenticated);

router.get('/', function (req, res) {
    var title = 'All Games';
    Game.find({}, function(err, games){
        return res.render(path.join('game', 'index'), {title: title, game: games});
    });
});

router.get('/:gameId', function(req, res) {
    Game.findOne({gameId: req.params.gameId}, function(err, game){
        var title = game.title;
        var p1 = Team.findById(game.homeTeam).exec();
        var p2 = Team.findById(game.awayTeam).exec();
        Promise.all([p1, p2])
            .then(function(teams){
                var p3 = Player.find({_id: {$in: teams[0].players}}).exec();
                var p4 = Player.find({_id: {$in: teams[1].players}}).exec();
                Promise.all([p3, p4])
                    .then(function(players){
                        teams[0].players = players[0];
                        teams[1].players = players[1];
                        return res.render(path.join('game', 'game'),
                            {title:title, game:game, homeTeam:teams[0], awayTeam:teams[1]});
                    });
            });
    });
});

module.exports = router;