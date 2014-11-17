/**
 * All the functions related to manipulating and retrieving information
 * from the User database
 *
 * @author: Anji Ren, Lily Seropian, Dylan Joss
 */
var User = require('../models/user');
var ManagerUser = require('../models/manager-user');
var EmployeeUser = require('../models/employee-user');
var OrgController   = require('../controllers/organization');
var errors = require('../errors/errors');
module.exports = {};

var getUserModel = module.exports.getUserModel = function(type) {
    if (type.toLowerCase() == 'manager') {
        return ManagerUser;
    } 
    else if (type.toLowerCase() == 'employee') {
        return EmployeeUser;
    }
    throw new Error('Unknown account type:', type);
}

/**
 * Function to create a user
 * @param {String} name:          user full name
 * @param {String} email:         user email
 * @param {String} password:      user password
 * @param {String} org:           organization user is part of
 * @param {Number} scheduleID:    a user's scheduleID (null if the user is a manager)
 * @param {function} callback:    callback function
 */
module.exports.createUser = function(name, email, password, org, scheduleID, callback) {    
    var userModel;

    var userData = {
        name: name,
        email: email,
        password: password,
        org: org
    };

    if (scheduleID) {
        userData.schedule = scheduleID;

        userModel = EmployeeUser;
    }
    else {
        userModel = ManagerUser;
    }

    var newUser = new userModel(userData);
    var newUserCopy = new User(userData);

    // Add to specific database (i.e. ManagerUser or EmployeeUser)
    newUser.save(function(err, user) {
        if (err) {
            console.log(err);
        }

        // Add to User database
        // We do this to avoid have to make queries on both ManagerUser DB and EmployeeUser DB
        // when looking up a user (and we don't know the user's type)
        newUserCopy._id = user._id;
        newUserCopy.save(callback);
    });
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