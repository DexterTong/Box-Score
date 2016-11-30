var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));

require(path.join(__dirname, '..', 'db'));

//TODO: call nba.updatePlayers beforehand, update after promise/then

nba.players.forEach(function (obj) {
    var player = {
        playerId: obj.playerId,
        firstName: obj.firstName,
        lastName: obj.lastName
    };
    var query = {playerId: obj.playerId};
    var update = player;
    var options = {upsert: true, setDefaultsOnInsert: true};
    Player.findOneAndUpdate(query, update, options, function (err) {
        if (err)
            console.log(err);
    });
});
console.log('Updated player data successfully');
mongoose.disconnect();