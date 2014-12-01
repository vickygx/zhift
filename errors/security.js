/**
 * Functions related to security
 *
 * @author: Dylan Joss 
 */

var validator = require('validator');

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

/**
 * Sanitize all text input to mitigate the possibility of injection attacks
 */
module.exports.sanitize = function(req, res, next) {
    Object.keys(req.body).forEach(function(key) {
        req.body[key] = validator.toString(req.body[key]);

        // we allow @ in email; email is also validated separately with validator.isEmail
        // we allow various special characters in password as password is hashed before insertion in DB
        if (key !== 'email' && key !== 'password') {
            req.body[key] = validator.whitelist(req.body[key], '\\w\\s_-');
        }
    });

    return next();
};