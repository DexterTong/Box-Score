var path = require('path');
var mongoose = require('mongoose');
var nba = require('nba');
var Player = require(path.join(__dirname, '..', 'models', 'player'));
require(path.join(__dirname, '..', 'db'));

//TODO: call nba.updatePlayers beforehand, update after promise/then

//TODO: add players to DB

mongoose.disconnect();