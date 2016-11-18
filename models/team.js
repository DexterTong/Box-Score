var mongoose = require('mongoose');

var Team = new mongoose.Schema({
    teamId: {type: Number},
    abbreviation: {type: String},
    fullName: {type: String},
    name: {type: String},
    city: {type: String},
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('Team', Team);