//middleware to add the currently logged in user to the context for template rendering

function thisUser(req, res, next){
    res.locals.thisUser = req.user;
    next();
}

module.exports = {
    thisUser: thisUser
};