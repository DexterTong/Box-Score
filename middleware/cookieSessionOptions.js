//Strictly speaking, not a middleware itself, but this is used for the cookie-session middleware

var fs = require('fs');
var path = require('path');

function cookieSessionOptions(){
    var options = {
        maxAge: 604800000,  //This is exactly 1 week in ms
        name: "session",
        httpOnly: true,
        signed: true
    };
    var config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json')));
    options.keys = config.cookieSession.keys;
    return options;
}

module.exports = {
    cookieSessionOptions: cookieSessionOptions
};