var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Team = require(path.join(__dirname, '..', 'models', 'team'));
require(path.join(__dirname, '..', 'db'));

nba.teams.forEach(function(team){
    var currentTeam = new Team({
        teamId: team.teamId,
        abbreviation: team.abbreviation,
        fullName: team.teamName,
        name: team.simpleName,
        city: team.location,
        players: []
    });
    var query = {teamId: currentTeam.teamId};
    var update = currentTeam;
    var options = {upsert: true};
    Team.findOneAndUpdate(query, update, options, function(err, res){});
});

mongoose.disconnect();