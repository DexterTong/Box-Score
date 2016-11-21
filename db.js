var mongoose = require('mongoose');

var connectionString;

if (process.env.NODE_ENV == 'PRODUCTION') {

    var fs = require('fs');
    var path = require('path');
    var fn = path.join(__dirname, 'config.json');
    var data = fs.readFileSync(fn);
    var conf = JSON.parse(data);
    connectionString = 'mongodb://' + conf.username + ':' + conf.password + '@' + conf.address + '/' + conf.database;
}
else
    connectionString = 'mongodb://localhost/box-score';

mongoose.connect(connectionString, function (err) {
    if (err)
        console.log('Unable to connect to MongoDB.');
});