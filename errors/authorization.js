

// TODO put all this on module.exports then require it in whatever file uses it
// 
// isEmployee
// isManager
// 
// isEmployeeOfOrg cannot be done in middleware


/**
 * Authentication middleware: redirect the user to '/' if they are not authenticated.
 */
module.exports.isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects.
    if (req.isAuthenticated()) {
        return next();
    }

    // TODO: delete
    // if the user is not authenticated then redirect them to the login page
    if (req.method === 'GET') {
        return res.redirect('/');
    }
    if (req.method === 'POST') {
        return res.status(401).send('/');
    }
    if (req.method === 'PUT') {
        console.log('put');
        return res.status(401).send('/');
    }
};

module.exports.isEmployeeOfOrg = function(org) {
    return function(req, res, next) {
        if (req.user.org === org) {
            return next();
        }
        res.redirect('/');
    }
};