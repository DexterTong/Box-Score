var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var Promise = require('promise');
var User = require(path.join(__dirname, '..', 'models', 'user'));
var Team = require(path.join(__dirname, '..', 'models', 'team'));
var Prediction = require(path.join(__dirname, '..', 'models', 'prediction'));
var auth = require(path.join(__dirname, '..', 'middleware', 'authentication'));
var predictionHelper = require(path.join(__dirname, '..', 'helpers', 'predictionHelper'));

router.use(auth.isAuthenticated);

//Search for users
router.get('/', function (req, res) {
    var title;
    if (req.query.username) {
        title = 'Results for \'' + req.query.username + '\'';
        User.find({username: {"$regex": req.query.username, "$options": "i"}}, function (err, users) {
            if (err) {
                console.log(err);
                return res.status(500);
            }
            return res.render(path.join('user', 'index'), {title: title, user: users});
        });
    }
    else {
        title = 'User Search';
        return res.render(path.join('user', 'index'), {title: title});
    }
});

//TODO: display user info, bets, etc
//TODO: handle case when user data fields such as fav team are undefined
router.get('/:user', function (req, res) {
    User.findOne({username: req.params.user}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500);
        }
        if (!user) {
            // user requested DNE
            return res.redirect('/');
        }
        var predictions = user.predictions.map(function (predictionId) {
            return Prediction.findById(predictionId);
        });
        var predictionsPromise = Promise.all(predictions)
            .then(function (preds) {
                var annotatedPredictions = preds.map(function (prediction) {
                    return predictionHelper.getReferences(prediction);
                });
                return Promise.all(annotatedPredictions);
            });
        var teamPromise = Team.findById(user.favoriteTeam);
        Promise.all([predictionsPromise, teamPromise])
            .then(function(results){
                var teamName;
                console.log('hello');
                if(results[1])
                    teamName = results[1].city + ' ' + results[1].name;
                var title = user.username + '\'s page';
                return res.render(path.join('user', 'user'),
                    {user: user, teamName: teamName, title: title, prediction: results[0]});
            })
    });
});

module.exports = router;