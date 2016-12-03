var mongoose = require('mongoose');

var Game = new mongoose.Schema({
    gameId: {type: Number},
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    season: {type: Number},
    title: String,
    date: Date,
    time: String,
    status: String,
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction', default: [] }]
    //May want to include stuff like box score and all, or just request it from NBA website
});

module.exports = mongoose.model('Game', Game);