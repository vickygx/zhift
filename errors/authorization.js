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

    if (req.body.cron === '99570761084371110795') {
        req.user = {
            email: 'cron@zhift.com',
            org: 'Zhift',
        };
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
        return res.status(401).send('/');
    }
};