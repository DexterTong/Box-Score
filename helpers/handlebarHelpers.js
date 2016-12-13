var hbs = require('hbs');

hbs.registerHelper('ifequal', function(arg1, arg2){
    if(!arg1 || !arg2)
        return '';
    if(arg1.toString() === arg2.toString())
        return 'selected';
});

hbs.registerHelper('displayLastName', function(uname1, uname2, lastName){
    if(uname1 === uname2)
        return new hbs.SafeString('<tr> <td>Last Name: </td><td>' + lastName + '</td> </tr>');
    else
        return '';
});

hbs.registerHelper('linkUser', function(username){
   return new hbs.SafeString('<a href="/user/' + username + '">' + username + '</a>');
});

hbs.registerHelper('linkGame', function(gameId, title){
    return new hbs.SafeString('<a href="/game/' + gameId + '">' + title + '</a>');
});

hbs.registerHelper('linkTeam', function(teamName){
    return new hbs.SafeString('<a href="/team/' + teamName + '">' + teamName + '</a>');
});

hbs.registerHelper('linkPrediction', function(prediction){
    return new hbs.SafeString('<a href="/prediction/' + predictionId + '">' + predictionId + '</a>');
});

module.exports = hbs;