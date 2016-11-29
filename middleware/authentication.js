//Check if client is logged in, if not, send to login page
function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

//If client is logged in, send to homepage (keep logged-in users away from login and register page)
function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return res.redirect('/');
    return next();
}

module.exports = {
    isAuthenticated: isAuthenticated,
    isNotAuthenticated: isNotAuthenticated
};