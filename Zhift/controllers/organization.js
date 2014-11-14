/*  All the functions related to manipulating and retrieving information 
    from the Organization database

    @author: Vicky Gong
*/
var Organization = require('../models/organization');
var errors = require('../errors/errors');
module.exports = {};

/*  Function to create an org
    
    @param 
        {String} name:          Name of the organization
        {function} fn :         call back function

    @return ---
*/
module.exports.createOrg = function(name, fn){
    // Create new Shift
    var org = new Organization({
       _id: name
    });

    // Add to database
    org.save(fn);
};

/*  Function to get an org
    
    @param 
        {String} name:          Name of the organization to get
        {function} fn :         call back function

    @return ---
*/
module.exports.getOrg = function(name, fn){
    Organization.findById(name, fn);
}