var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));

require(path.join(__dirname, '..', 'db'));

//TODO: call nba.updatePlayers beforehand, update after promise/then


var teamIdDict = {};

Team.find({}, function (err, teams) {
    if (err)
        console.log(err);
    teams.forEach(function (team) {
        teamIdDict[team.teamId] = team._id;
    });
}).then(updatePlayers).then(disconnect);

function updatePlayers() {
    console.log(teamIdDict);
    nba.players.forEach(function (obj) {
        var player = {
            playerId: obj.playerId,
            firstName: obj.firstName,
            lastName: obj.lastName,
            team: teamIdDict[obj.teamId]
        };
        //console.log(teamIdDict[obj.teamId]);
        var query = {playerId: obj.playerId};
        var update = player;
        var options = {upsert: true, setDefaultsOnInsert: true};
        Player.findOneAndUpdate(query, update, options, function (err) {
            if (err)
                console.log(err);
        });
    });
    console.log('Updated player data successfully');
}

function disconnect() {
    mongoose.disconnect();
}