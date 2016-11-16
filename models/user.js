var mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    // Fields added by passportLocalMongoose...
    // username: stuff
    // hash: stuff
    // salt: stuff

    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    score : { type: Number, default: 0}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);