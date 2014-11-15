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

    var newUser = new newUser({
        name: name,
        email: email,
        password: password,
        org: org
    });

    // Add to database
    newUser.save(callback);
};

/**
 * Function to retrieve existing manager
 * @param {String} email:         manager email
 * @param {String} org:           organization employee is part of
 * @param {function} callback:    callback function - called with manager, if
 *                                found, otherwise with error
 */
module.exports.retrieveManagerUser = function(email, org, callback) {
    ManagerUser.findOne({email: email, org: org}, function(err, managerUser) {
        if (err) {
            return callback(err);
        } 
        if (!managerUser) {
            return callback(null, false, {message: 'Incorrect name or organization.'})
        } 
        callback(null, managerUser);
    });
};

/**
 * Function to retrieve existing employee
 * @param {String} email:         employee email
 * @param {String} org:           organization employee is part of
 * @param {function} callback:    callback function - called with manager, if
 *                                found, otherwise with error
 */
module.exports.retrieveEmployeeUser = function(email, org, callback) {
    EmployeeUser.findOne({email: email, org: org}, function(err, employeeUser) {
        if (err) {
            return callback(err);
        } 
        if (!employeeUser) {
            return callback(null, false, {message: 'Incorrect name or organization.'})
        } 
        callback(null, employeeUser);
    });
};