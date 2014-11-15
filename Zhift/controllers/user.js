/**
 * All the functions related to manipulating and retrieving information
 * from the User database
 *
 * @author: Anji Ren, Lily Seropian
 */
var User = require('../models/user');
var ManagerUser = require('../models/manager-user');
var EmployeeUser = require('../models/employee-user');
var errors = require('../errors/errors');
module.exports = {};

var getUserModel = module.exports.getUserModel = function(type) {
    if (type.toLowerCase() == 'manager') {
        return ManagerUser;
    } 
    else if (type.toLowerCase() == 'employee') {
        return EmployeeUser;
    }
}

/**
 * Function to create a user
 * @param {String} name:          user full name
 * @param {String} email:         user email
 * @param {String} password:      user password
 * @param {String} org:           organization user is part of
 * @param {function} callback:    callback function
 */
module.exports.createUser = function(name, email, password, org, type, callback) {
    // Create new User depending on type
    var newUser = getUserModel(type);

    var userData = {
        name: name,
        email: email,
        password: password,
        org: org
    };

    var newUser = new newUser(userData);
    var newUserCopy = new User(userData);

    // Add to specific database (i.e. manager or employee)
    newUser.save(callback);
    // Add to User database
    newUserCopy.save(callback);
};

/**
 * Function to retrieve existing user
 * @param {String} email:         user email
 * @param {String} org:           organization user is part of
 * @param {function} callback:    callback function - called with user, if
 *                                found, otherwise with error
 */
module.exports.retrieveUser = function(email, org, callback) {
    User.findOne({email: email, org: org}, function(err, user) {
        if (err) {
            return callback(err);
        } 
        if (!user) {
            return callback(null, false, {message: 'Incorrect name or organization.'})
        } 
        callback(null, user);
    });
};