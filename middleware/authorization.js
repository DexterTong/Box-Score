function isAdmin(req, res, next){
    if(!req.user || !req.user.isAdmin)
        return res.redirect('/');
    return next();
}

module.exports = {
    isAdmin: isAdmin
};