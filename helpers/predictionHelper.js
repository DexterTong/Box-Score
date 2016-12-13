var path = require('path');
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Game = require(path.join(__dirname, '..', 'models', 'game'));
var Promise = require('promise');

function getReferences(prediction) {
    return Game.findById(prediction.game).exec()
        .then(function (game) {
            var winTeamPromise;
            var loseTeamPromise;
            var userPromise = User.findById(prediction.user).exec();
            if (prediction.winner == 'home') {
                winTeamPromise = Team.findById(game.homeTeam).exec();
                loseTeamPromise = Team.findById(game.awayTeam).exec();
            }
            else {
                loseTeamPromise = Team.findById(game.homeTeam).exec();
                winTeamPromise = Team.findById(game.awayTeam).exec();
            }
            return Promise.all([userPromise, game, winTeamPromise, loseTeamPromise])
                .then(function (results) {
                    return {user: results[0], game: results[1], winner: results[2], loser: results[3]};
                })
        })
        .catch(function(err){
            console.log(err);
        });
}

module.exports = {
    getReferences: getReferences
};