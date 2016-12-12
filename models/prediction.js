var mongoose = require('mongoose');

var Prediction = new mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    winner: [{type: String, enum: ['home', 'away']}]
});

module.exports = mongoose.model('Prediction', Prediction);