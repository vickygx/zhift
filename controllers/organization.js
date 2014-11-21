/**  
 * All the functions related to manipulating and retrieving information 
 * from the Organization database
 *
 * @author: Vicky Gong
 */
var Organization = require('../models/organization');
var errors = require('../errors/errors');
module.exports = {};

/**  
 * Create an org
 *   
 * @param {String} name: name of the organization to create
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.createOrg = function(name, fn) {
    var org = new Organization({
       _id: name
    });

    org.save(fn);
};

/**  
 * Retrieve an org, given its name
 *   
 * @param {String} name: name of the organization to retrieve
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.retrieveOrg = function(name, fn) {
    Organization.findById(name, fn);
}