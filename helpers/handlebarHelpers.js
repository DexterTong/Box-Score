var hbs = require('hbs');

hbs.registerHelper('ifequal', function(arg1, arg2){
    if(!arg1 || !arg2)
        return '';
    if(arg1.toString() === arg2.toString())
        return 'selected';
});

hbs.registerHelper('linkUser', function(username){
   return new hbs.SafeString('<a href="/user/' + username + '">' + username + '</a>');
});

hbs.registerHelper('linkGame', function(gameId){
    return new hbs.SafeString('<a href="/game/' + gameId + '">' + gameId + '</a>');
});

hbs.registerHelper('linkTeam', function(teamName){
    return new hbs.SafeString('<a href="/team/' + teamName + '">' + teamName + '</a>');
});

hbs.registerHelper('linkPlayer', function(playerId){
    return new hbs.SafeString('<a href="/player/' + playerId + '">' + playerId + '</a>');
});

hbs.registerHelper('linkPrediction', function(predictionId){
    return new hbs.SafeString('<a href="/prediction/' + predictionId + '">' + predictionId + '</a>');
});

module.exports = hbs;