var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    // Fields added by passportLocalMongoose...
    // username: stuff
    // hash: stuff
    // salt: stuff
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    favoriteTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    score : { type: Number, default: 0},
    isAdmin : {type: Boolean, default: false}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);