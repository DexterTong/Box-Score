function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return res.redirect('/');
    return next();
}

module.exports = {
    isAuthenticated: isAuthenticated,
    isNotAuthenticated: isNotAuthenticated
};