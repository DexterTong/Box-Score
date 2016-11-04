var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;

//A user, what else?
var User = new Schema({
    // username and password come from passport
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }],
    // friendship is reciprocal: B is a friend of A implies A is a friend of B
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    score : { type: Number, default: 0}
});

//Represents a team and its players
var Team = new Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

//Represents an active basketball player
var Player = new Schema({
    name: String,
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    //Will probably want to store stuff like basic stats or something too
});

//Represents a single basketball game, or at least the parts we care about
var Game = new Schema({
    //The 2 teams participating in the game
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    //When is the game? Will let us know when to check final score
    date: String,
    time: String,
    //Has the game started, is it ongoing, or finished?
    status: String,
    //Keep track of which predictions are for this game
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }]
    //May want to include stuff like box score and all, or just request it from NBA website
});

//A single prediction or 'bet', will need generalization later, probably
var Prediction = new Schema({
    //Whose prediction is it?
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //Which game is it for?
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    //Which player is it for?
    player: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    //Details of the prediction
    stat: String,
    value: Number,
    OverUnder: Boolean,
    //How much is it worth?
    score: Number
});