var hbs = require('hbs');

hbs.registerHelper('ifequal', function(arg1, arg2){
    if(!arg1 || !arg2)
        return '';
    if(arg1.toString() === arg2.toString())
        return 'selected';
});

module.exports = hbs;