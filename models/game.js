var mongoose = require('mongoose');

var Game = new mongoose.Schema({
    teams: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
        validate: {
            validator: function(teamArr){
                return teamArr.length === 2;
            },
            message: 'A Basketball game is between exactly 2 teams.'
        }},
    date: String,
    time: String,
    status: String,
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }]
    //May want to include stuff like box score and all, or just request it from NBA website
});

module.exports('Game', Game);