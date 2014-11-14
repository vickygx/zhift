/*  All the functions related to manipulating and retrieving information 
    from the User database

    @author: Anji Ren
*/
var ManagerUser = require('../models/manager-user');
var EmployeeUser = require('../models/employee-user');
var errors = require('../errors/errors');
module.exports = {}

/*  Function to create a user
    
    @param 
        {String} userName:      user's full name
        {String} userPass:      user's password
        {String} userOrg:       organization user is part of
        {function} fn: 			callback function

    @return ---
*/
var getUserModel = module.exports.getUserModel = function(type) {
  if (type.toLowerCase() == "manager") {
    return ManagerUser;
  } else if (type.toLowerCase() == "employee") {
    return EmployeeUser;
  }
}

module.exports.createUser = function(userName, userPass, userOrg, type, fn){
    // Create new User depending on type
    var newUser = getUserModel(type);

    var newUser = new User({
        name: userName,
        password: userPass,
        org: userOrg
    })

    // Add to database
    newUser.save(fn);
};
