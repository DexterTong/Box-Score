var mongoose = require('mongoose');


//TODO: store other player data like stats, or maybe just call API
var Player = new mongoose.Schema({
    playerId: {type: Number, required: true},
    firstName: {type: String, default: '', required: true},
    lastName: {type: String, default: '', required: true},
    //team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null, required: false}
});

module.exports = mongoose.model('Player', Player);