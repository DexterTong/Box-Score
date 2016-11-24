var mongoose = require('mongoose');

var connectionString;

if (process.env.NODE_ENV == 'PRODUCTION') {

    var fs = require('fs');
    var path = require('path');
    var prodEnv = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'))).prodEnv;
    connectionString = 'mongodb://' + prodEnv.username + ':' + prodEnv.password + '@'
        + prodEnv.address + '/' + prodEnv.database;
}
else
    connectionString = 'mongodb://localhost/box-score';

mongoose.connect(connectionString, function (err) {
    if (err)
        console.log('Unable to connect to MongoDB.');
});