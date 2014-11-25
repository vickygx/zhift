/**
 * All the functions related to manipulating and retrieving information from the User database.
 *
 * TODO: fix error handling
 * 
 * @author: Anji Ren, Lily Seropian, Dylan Joss
 */

var User = require('../models/user');
var ManagerUser = require('../models/manager-user');
var EmployeeUser = require('../models/employee-user');
var OrgController   = require('../controllers/organization');
var ScheduleController   = require('../controllers/schedule');
var errors = require('../errors/errors');
module.exports = {};

/**
 * Create a user.
 * @param {String}   name       User full name.
 * @param {String}   email      User email.
 * @param {String}   password   User password.
 * @param {String}   org        Organization user is part of.
 * @param {Number}   scheduleID A user's scheduleID (not set if the user is a manager).
 * @param {Function} callback   Callback that takes (err, user).
 */
module.exports.createUser = function(name, email, password, org, role, callback) {    
    var userModel;

    var userData = {
        name: name,
        email: email,
        password: password,
        org: org
    };

    var newUser = new User(userData);

    newUser.save(function(err, user) {
        if (err) {
            return callback(err);
        }
        console.log('just created new user');
        userData._id = user._id;

        if (role) {
            ScheduleController.retrieveScheduleByOrgAndRole(org, role, function(err, schedule) {
                if (err) {
                    return callback(err);                 
                }
                if (schedule) {
                    console.log('just looked up schedule id');
                    userData.schedule = schedule._id;

                    var newEmployee = new EmployeeUser(userData);

                    console.log('about to save new employee');

                    newEmployee.save(function(err, employee) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, employee);
                    });
                }
                else {
                    return callback(new Error('No schedule found for that organization and role.'));
                }
            });
        }
        else {
            var newManager = new ManagerUser(userData);

            console.log('about to save new manager');
            newManager.save(function(err, manager) {
                if (err) {
                    return callback(err);
                }
                callback(null, manager);
            });
        }
    });
};

/**
 * Retrieve existing user.
 * @param {String}   email    User email.
 * @param {String}   org      Organization user is part of.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveUser = function(email, org, callback) {
    User.findOne({email: email, org: org}, function(err, user) {
        if (err) {
            return callback(err);
        } 
        if (!user) {
            return callback(err, {message: 'Incorrect name or organization.'})
        } 
        callback(null, user);
    });
};

/**
 * Retrieve existing employee by id.
 * @param {ObjectId} id       Employee id.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveEmployeeById = function(id, callback) {
    EmployeeUser.findById(id, function(err, employeeUser) {
        if (err) {
            return callback(err);
        } 
        if (!employeeUser) {
            return callback(null, false, {message: 'Incorrect employee id.'})
        } 
        callback(null, employeeUser);
    });
};

/**
 * Retrieve existing manager by id.
 * @param {ObjectId} id       Manager id.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveManagerById = function(id, callback) {
    ManagerUser.findById(id, function(err, managerUser) {
        if (err) {
            return callback(err);
        } 
        if (!managerUser) {
            return callback(null, false, {message: 'Incorrect manager id.'})
        } 
        callback(null, managerUser);
    });
};

/** 
 * Retrieve all employees associated with the org with the id.
 * @param {ObjectId} id       Org id.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveEmployeesByOrgId = function(id, callback) {
    EmployeeUser.find({org: id}, function(err, employeeUsers) {
        if (err) {
            return callback(err);
        } 
        if (!employeeUsers) {
            return callback(null, false, {message: 'Incorrect org id.'})
        } 
        callback(null, employeeUsers);
    });
};

/** 
 * Retrieve all managers associated with the org with the id.
 * @param {ObjectId} id       Org id.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveManagersByOrgId = function(id, callback) {
    ManagerUser.find({org: id}, function(err, managerUsers) {
        if (err) {
            return callback(err);
        } 
        if (!managerUsers) {
            return callback(null, false, {message: 'Incorrect org id.'})
        } 
        callback(null, managerUsers);
    });
};

/** 
 * Retrieve all employees associated with the schedule with the id.
 * @param {ObjectId} id       Org id.
 * @param {Function} callback Callback that takes (err, user).
 */
module.exports.retrieveEmployeesByScheduleId = function(id, callback) {
    EmployeeUser.find({schedule: id}, function(err, employeeUsers) {
        if (err) {
            return callback(err);
        } 
        if (!employeeUsers) {
            return callback(null, false, {message: 'Incorrect schedule id.'})
        } 
        callback(null, employeeUsers);
    });
};

/** 
 * Check if given user is in the organization.
 * @param {ObjectId} userEmail User email.
 * @param {String}   orgName   Name of organization.
 * @param {Function} callback  Callback that takes (err, user).
 */
module.exports.isUserOfOrganization = function(userEmail, orgName, fn){
    User.findOne({email: userEmail, org: orgName}, function(err, user) {
        fn(err, !err && user);
    });
}

/** 
 * Check if given user is a manager of the organization.
 * @param {ObjectId} userEmail User email.
 * @param {String}   orgName   Name of organization.
 * @param {Function} callback  Callback that takes (err, user).
 */
module.exports.isManagerOfOrganization = function(userEmail, orgName, fn){
    ManagerUser.findOne({email: userEmail, org: orgName}, function(err, manager) {
        fn(err, !err && manager);
    });
}

/** 
 * Check if given user is a member of the schedule.
 * @param {ObjectId} userEmail  User email.
 * @param {String}   scheduleId The id of schedule.
 * @param {Function} callback   Callback that takes (err, user).
 */
module.exports.isEmployeeOfRole = function(userEmail, scheduleId, fn){
    EmployeeUser.findOne({email: userEmail, schedule: scheduleId}, function(err, employee) {
        fn(err, !err && employee);
    });
}