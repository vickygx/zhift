

// TODO put all this on module.exports then require it in whatever file uses it
// 
// isEmployee
// isManager
// 
// isEmployeeOfOrg cannot be done in middleware


/**
 * Authentication middleware: redirect the user to '/' if they are not authenticated.
 */
var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects.
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports.isEmployeeOfOrg = function(org) {
    return function(req, res, next) {
        if (req.user.org === org) {
            return next();
        }
        res.redirect('/');
    }
}


shift.get('/', isEmployeeOfOrg())