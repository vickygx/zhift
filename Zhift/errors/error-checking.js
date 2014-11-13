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

/**
* Returns true if the timeString represents an invalid time, false otherwise
*
* @param {String} timeString
* return {Boolean}
*/
module.exports.badTime = function(timeString) {
	var hourString = timeString.split(":")[0];
	var minuteString = timeString.split(":")[1];
	if (hourString.length > 2 || minuteString.length > 2) {
		return true;
	} 
	var hour = parseInt(hourString);
	var minute = parseInt(minuteString);
	if (hour > 60 || minute > 60) {
		return true;
	}
	return false;
}