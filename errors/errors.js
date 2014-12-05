/**
 * File containing specific errors used by the app
 *
 * @author: Vicky Gong, Lily Seropian
 */

// Any specific errors go into their own object
module.exports.orgs = {};
module.exports.users = {};
module.exports.shifts = {};
module.exports.schedules = {};
module.exports.records = {};
module.exports.swaps = {};
module.exports.templateshifts = {};
module.exports.users = {};

/**
 * Create an error.
 * @param  {Number} status  The status code for the error.
 * @param  {String} name    The name of the error.
 * @param  {String} message Details about the error.
 * @return {Object}         An error that may be used as an HTTP response.
 */
var createError = function(status, name, message) {
    return {
        status: status,
        name: name,
        message: message
    };
};

/**
 * Create a 400 error message.
 * @param  {String} message Details about the error.
 * @return {Object}         An error that may be used as an HTTP response.
 */
var create400 = function(message) {
    return createError(400, 'Bad Input', message);
};

/**
 * Create a 401 error message.
 * @param  {String} message Details about the error.
 * @return {Object}         An error that may be used as an HTTP response.
 */
var create401 = function(message) {
    return createError(401, 'Bad Permissions', message);
};

/**
 * Create a 404 error message.
 * @param  {String} message Details about the error.
 * @return {Object}         An error that may be used as an HTTP response.
 */
var create404 = function(message) {
    return createError(404, 'Not Found', message);
};

//================== Org error functions =================//

module.exports.orgs.invalidId = create404('The given organization does not exist.');

//================== User error functions =================//

module.exports.users.invalidUserId = create400('The given user id does not exist.');

module.exports.users.badManager = create401('Unauthorized, you are not a manager of the appropriate organization.');

module.exports.users.badUserPasswordChange = create401('Unauthorized, you cannot change the password of another user account.');

//================== Shift error functions =================//

module.exports.shifts.notManagerGetShifts = create401('Unauthorized, you are not a manager or the owner of the requested employee. Cannot get shifts.');

module.exports.shifts.invalidShiftId = create400('The given shift id does not exist for the current user.');

module.exports.shifts.notOwnerOfShift = create401('User is not owner of shift. Cannot put up for grabs.');

module.exports.shifts.shiftForWeekAlreadyCreated = create400('Shift associated with this template shift and week already exists! Try another week!');

module.exports.shifts.templateShiftDoesNotExist = create400('Cannot create shift from this template shift. Id does not exist.');

module.exports.shifts.invalidDate = create400('Cannot get shifts within this date. Invalid Date.');

module.exports.shifts.employeeNotFound = create404('Invalid user id.');

module.exports.shifts.notManagerCreate = create401('Unauthorized, you are not a manager or the owner of the requested template shift. Cannot create shift.');

module.exports.shifts.notManagerGet = create401('Unauthorized, you are not a manager or the owner of the requested shift.');

//================== Schedule error functions =================//

module.exports.schedules.invalidScheduleId = create400('The given schedule id does not exist');

module.exports.schedules.unauthorizedCreate = create401('Unauthorized, you are not a manager of the appropriate organization. Cannot create schedule.');

module.exports.schedules.unauthorizedDelete = create401('Unauthorized, you are not a manager of the appropriate organization. Cannot delete schedule.');

module.exports.schedules.unauthorizedGet = create401('Unauthorized, you are not a manager of the appropriate organization. Cannot get schedule.');

//================== Record error functions =================//

module.exports.records.invalidScheduleId = create404('The given schedule id does not exist.');

module.exports.records.unauthorized = create401('Unauthorized, you are not a manager of the appropriate organization. Cannot get records.');

//================== Swap error functions =================//

module.exports.swaps.unauthorized = create401('Unauthorized, you are not an employee of the appropriate schedule.');

module.exports.swaps.noSwapForShift = create404('This shift has no swaps associated with it.');

module.exports.swaps.badSwap = create400('Unidentified request.');

//================== Template Shift error functions =================//

module.exports.templateshifts.badSchedule = create401('Employee and schedule are part of different organizations.');

module.exports.templateshifts.badManager = create401('Unauthorized, you are not a manager of the appropriate organization.');