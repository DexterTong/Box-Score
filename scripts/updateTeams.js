var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Team = require(path.join(__dirname, '..', 'models', 'team'));
require(path.join(__dirname, '..', 'db'));


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
    Team.findOneAndUpdate(query, update, options, function (err) {
        if (err)
            console.log(err);
    });
});
console.log('Updated team data successfully');

mongoose.disconnect();