var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Promise = require('promise');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));

mongoose.Promise = Promise;

require(path.join(__dirname, '..', 'db'));

var teamIdDict = {};

nba.updatePlayers().then(
    Team.find({}, function (err, teams) {
        if (err)
            console.log(err);
        teams.forEach(function (team) {
            teamIdDict[team.teamId] = team._id;
        });
    })
).then(updatePlayers);

function updatePlayers() {
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
        Player.findOneAndUpdate(query, update, options, function (err, res) {
            if (err)
                console.log(err);
            Team.findByIdAndUpdate(teamId, {$addToSet: {"players": res._id}}, function (err, res) {
                if (err)
                    console.log(err);
            });
        });
    });
}

function disconnect() {
    mongoose.disconnect();
}