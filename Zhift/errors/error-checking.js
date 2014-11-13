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

/*  Checks to see if given value is of proper day of week format
    
    Requirements: must be in
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
    
    @param {String} value
    @return {Boolean}
*/
module.exports.shifts.isProperDayOfWeek = function(value){
    return /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i.test(value);
}


/*  Checks to see if given value is of proper day of HH:MM format
    
    Requirements: must be in
        HH must be 0 - 23
        MM must be 0 - 59

    @param {String} value
    @return {Boolean}
*/

module.exports.shifts.isProperTime = function(value){
    var isProperFormat = /^\d\d:\d\d$/i.test(value);

    var hour = parseInt(timeString.split(":")[0]);
    var minute = parseInt(timeString.split(":")[1]);
    
    var isProperTime = hour < 24 && minute < 60;
   
    return isProperFormat && isProperTime
}
