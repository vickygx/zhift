/*  File containing all error checkings and helper functions
    used by the app

    @author: Vicky Gong 
*/

var errors = require('./errors');

// Any specific errors go into their own object
module.exports.users = {};
module.exports.shifts = {};

//================== Global error functions =================//

/**
 * Returns true if the id is a improper ObjectID, false otherwise
 *
 * @param {String} id
 * @return {Boolean}
 */
module.exports.invalidId = function(id) {
  return !ObjectId.isValid(id);
}