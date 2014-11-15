/*  All the functions related to manipulating and retrieving information 
    from the User database

    @author: Anji Ren
*/
var User = require('../models/user');
var ManagerUser = require('../models/manager-user');
var EmployeeUser = require('../models/employee-user');
var errors = require('../errors/errors');
module.exports = {}

var getUserModel = module.exports.getUserModel = function(type) {
  if (type.toLowerCase() == "manager") {
    return ManagerUser;
  } else if (type.toLowerCase() == "employee") {
    return EmployeeUser;
  }
}

/*  Function to create a user
    
    @param 
        {String} name:          user full name
        {String} email:         user email
        {String} password:      user password
        {String} org:           organization user is part of
        {function} callback:    callback function

    @return ---
*/
module.exports.createUser = function(name, email, password, org, type, callback) {
    // Create new User depending on type
    var newUser = getUserModel(type);

    var newUser = new User({
        name: name,
        email: email,
        password: password,
        org: org
    })

    // Add to database
    console.log('New user successfully created.');
    newUser.save(callback);
};

/*  Function to retrieve existing user
    
    @param 
        {String} email:         user email
        {String} org:           organization user is part of
        {function} callback:    callback function

    @return user if found
*/
module.exports.retrieveUser = function(email, org, callback) {
    User.findOne({email: email, org: org}, function(err, user) {
        if (err) {
            callback(err);
        } 
        if (!user) {
            callback(null, false, {message: 'Incorrect name or organization.'})
        } 
        callback(null, user);
    })
};
