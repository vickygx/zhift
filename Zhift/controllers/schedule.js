/**  
 * All the functions related to manipulating and retrieving information 
 * from the Schedule database
 *
 * @author: Anji Ren, Dylan Joss
 */
var Schedule = require('../models/schedule');
var errors = require('../errors/errors');
module.exports = {};

/**  
 * Create a schedule
 *   
 * @param {String} orgName: name of organization
 * @param {String} role: role for which schedule displays shifts
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.createSchedule = function(orgName, role, fn) {
    var schedule = new Schedule({
       org: orgName,
       role: role
    });

    schedule.save(fn);
};

/**  
 * Retrieve a schedule, given its id
 *   
 * @param {ObjectId} scheduleId: id of the schedule to be retrieved
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.retrieveSchedule = function(scheduleId, fn) {
    Schedule.findById(scheduleId, fn);
}

/**  
 * Delete a schedule
 *   
 * @param {ObjectId} scheduleId: id of the schedule to be deleted
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.deleteSchedule = function(scheduleId, fn) {
    Schedule.findByIdAndRemove(scheduleId, fn);
}

/**  
 * Retrieve all schedules associated with an organization
 *   
 * @param {String} orgName: name of organization
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.retrieveSchedulesByOrg = function(orgName, fn) {
    Schedule.find({org: orgName}, fn);
}

/**  
 * Retrieve the schedule associated with an organization and a role
 *   
 * @param {String} orgName: name of organization
 * @param {String} roleName: name of role
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.retrieveScheduleByOrgAndRole = function(orgName, roleName, fn) {
    Schedule.findOne({org: orgName, role: roleName}, fn);
}
