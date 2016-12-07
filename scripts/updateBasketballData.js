var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');

var Promise = require('promise');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Game = require(path.join(__dirname, '..', 'models', 'game'));

mongoose.Promise = Promise;

require(path.join(__dirname, '..', 'db'));

var teamIdDict = {};

nba.updateTeams()
    .then(function () {
        var promises = [];
        nba.teams.forEach(function (team) {
            var currentTeam = {
                teamId: team.teamId,
                abbreviation: team.abbreviation,
                name: team.simpleName,
                city: team.location
            };
            var query = {teamId: currentTeam.teamId};
            var update = currentTeam;
            var options = {upsert: true, setDefaultsOnInsert: true};
            promises.push(Team.findOneAndUpdate(query, update, options).exec());
        });
        Promise.all(promises)
            .then(function () {
                console.log('Updated team data successfully');
                updatePlayers();
                updateGames();
            });
    });

function updatePlayers() {
    nba.updatePlayers()
        .then(
            Team.find({}, function (err, teams) {
                if (err)
                    console.log(err);
                teams.forEach(function (team) {
                    teamIdDict[team.teamId] = team._id;
                });
            })
        )
        .then(function () {
            var promises = [];
            nba.players.forEach(function (obj) {
                var teamId = teamIdDict[obj.teamId];
                var player = {
                    playerId: obj.playerId,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    team: teamId
                };
                var query = {playerId: obj.playerId};
                var update = player;
                var options = {upsert: true, setDefaultsOnInsert: true, new: true};
                promises.push(Player.findOneAndUpdate(query, update, options).exec()
                    .then(function (res) {
                        Team.findByIdAndUpdate(teamId, {$addToSet: {"players": res._id}}).exec();
                    })
                );
            });
            Promise.all(promises)
                .then(function () {
                    console.log('Updated player data successfully');
                    mongoose.disconnect();
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function updateGames() {
    var date = new Date();
    var month = date.getMonth() + 1 + '';     //Month ranges from 0 to 11, but date from 1 to 31. Why?!
    if (month.length === 1)
        month = '0' + month;
    var day = date.getDate() + '';
    if (day.length === 1)
        day = '0' + day;
    var today = month + '/' + day + '/' + date.getFullYear();
    nba.stats.scoreboard({gameDate: today})
        .then(function (scoreboard) {
            var games = scoreboard.gameHeader;
            Promise.all(games.map(function (gameData) {
                var p1 = Team.findOne({teamId: gameData.homeTeamId}).exec();
                var p2 = Team.findOne({teamId: gameData.visitorTeamId}).exec();
                Promise.all([p1, p2])
                    .then(function (teams) {
                        var game = {
                            gameId: parseInt(gameData.gameId),
                            title: gameData.gamecode,   //TODO: Make a more human-readable title
                            homeTeam: mongoose.Types.ObjectId(teams[0]._id),
                            awayTeam: mongoose.Types.ObjectId(teams[1]._id),
                            season: parseInt(gameData.season),
                            date: Date.parse(gameData.gameDateEst)
                        };
                        var query = {gameId: gameData.gameId};
                        var update = game;
                        var options = {upsert: true, setDefaultsOnInsert: true, new: true};
                        return Game.findOneAndUpdate(query, update, options).exec();
                    })
                    .catch(function (err) {
                        return console.log(err);
                    });
            }))
                .then(function () {
                    console.log('Update game data successfully');
                })
                .catch(function (err) {
                    return console.log(err);
                });
        })
        .catch(function (err) {
            return console.log(err)
        });
}