var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Promise = require('promise');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));

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
            .then(function(){
                console.log('Updated team data successfully');
                updatePlayers();
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