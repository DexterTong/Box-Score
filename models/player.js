var mongoose = require('mongoose');


//TODO: store other player data like stats, or maybe just call API
var Player = new mongoose.Schema({
    name: String,
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('Player', Player);