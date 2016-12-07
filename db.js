var mongoose = require('mongoose');

var connectionString;
var fs;
var path;
var prodEnv;

if (process.env.NODE_ENV == 'PRODUCTION_A') {
    fs = require('fs');
    path = require('path');
    prodEnv = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'))).prod_a;
    connectionString = 'mongodb://' + prodEnv.username + ':' + prodEnv.password + '@'
        + prodEnv.address + '/' + prodEnv.database;
}
else
    if (process.env.NODE_ENV == 'PRODUCTION_B') {
        fs = require('fs');
        path = require('path');
        prodEnv = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'))).prod_b;
        connectionString = 'mongodb://' + prodEnv.username + ':' + prodEnv.password + '@'
            + prodEnv.address + '/' + prodEnv.database;
    }
    else
        connectionString = 'mongodb://localhost/box-score';

mongoose.connect(connectionString, function (err) {
    if (err)
        console.log('Unable to connect to MongoDB.');
});