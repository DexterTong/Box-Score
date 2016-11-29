var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Player = require(path.join(__dirname, '..', 'models', 'player'));
require(path.join(__dirname, '..', 'db'));

//TODO: add player ids to team.players

mongoose.disconnect();