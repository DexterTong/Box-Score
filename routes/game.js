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
var Prediction = require(path.join(__dirname, '..', 'models', 'prediction'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));
var predictionHelper = require(path.join(__dirname, '..', 'helpers', 'predictionHelper'));

router.use(auth.isAuthenticated);

router.get('/', function (req, res) {
    var title = 'All Games';
    Game.find({}, function(err, games){
        var gamesByDate = games.reduce(function(groupedByDate, game){
            var key = getDate(game.date);
            if(groupedByDate[key])
                groupedByDate[key].push(game);
            else
                groupedByDate[key] = [game];
            return groupedByDate;
        }, {});
        return res.render(path.join('game', 'index'), {title: title, date: gamesByDate});
    });
});

function getDate(date){
    var dateString = date.toUTCString();
    var r = new RegExp(' [0-9]{2}:');
    return dateString.slice(0, dateString.search(r));
}

router.get('/:gameId', function(req, res) {
    Game.findOne({gameId: req.params.gameId}, function(err, game){
        var predictionsPromise;
        var predictions = game.predictions.map(function(predictionId){
            return Prediction.findById(predictionId);
        });
        predictionsPromise = Promise.all(predictions)
            .then(function(preds){
                var annotatedPredictions = preds.map(function(prediction){
                    return predictionHelper.getReferences(prediction);
                });
                return Promise.all(annotatedPredictions);
            });
        var title = game.title;
        var p1 = Team.findById(game.homeTeam).exec();
        var p2 = Team.findById(game.awayTeam).exec();
        Promise.all([p1, p2])
            .then(function(teams){
                var p3 = Player.find({_id: {$in: teams[0].players}}).exec();
                var p4 = Player.find({_id: {$in: teams[1].players}}).exec();
                Promise.all([p3, p4, predictionsPromise])
                    .then(function(results){
                        teams[0].players = results[0];
                        teams[1].players = results[1];
                        return res.render(path.join('game', 'game'),
                            {title:title, game:game, homeTeam:teams[0], awayTeam:teams[1], prediction:results[2]});
                    });
            });
    });
});

router.post('/:gameId/prediction', function(req, res) {
    if(!req.body.winner)
        return res.redirect('/game/' + req.params.gameId);
    Game.findOne({gameId: req.params.gameId}).exec()
        .then(function(game){
            var prediction = {
                user: req.user._id,
                game: game._id,
                winner: req.body.winner
            };
            Prediction.findOneAndUpdate({game: game._id, user: req.user._id}, prediction, {new: true, upsert: true})
                .then(function(newPrediction){
                    var p1, p2;
                    var predictions = req.user.predictions;
                    if(predictions.indexOf(newPrediction._id.toString()) < 0) {
                        predictions.push(newPrediction._id);
                        p1 = User.findByIdAndUpdate(req.user._id, {predictions: predictions});
                    }
                    var gamePredictions = game.predictions;
                    if(gamePredictions.indexOf(newPrediction._id.toString()) < 0) {
                        gamePredictions.push(newPrediction._id);
                        p2 = Game.findByIdAndUpdate(game._id, {predictions: gamePredictions});
                    }
                    Promise.all([p1, p2])
                        .then(function(){
                            return res.redirect('/game/' + req.params.gameId);
                        })
                })
                .catch(function(err){
                    return res.status(500);
            });

        })
});

module.exports = router;