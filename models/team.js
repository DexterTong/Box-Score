var mongoose = require('mongoose');

var Team = new mongoose.Schema({
    teamId: {type: Number, required: true},
    abbreviation: {type: String, required: true},
    name: {type: String, required: true},
    city: {type: String, required: true},
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] }]
});

module.exports = mongoose.model('Team', Team);