/**  
 * All the functions related to manipulating and retrieving information from the Schedule database.
 * @author: Anji Ren, Dylan Joss
 */

var Schedule = require('../models/schedule');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

module.exports = {};

/**  
 * Create a schedule.
 * @param {String}   orgName Name of organization.
 * @param {String}   role    Role for which schedule displays shifts.
 * @param {Function} fn      Callback that takes (err, schedule).
 */
module.exports.createSchedule = function(orgName, role, fn) {
    // Make sure role doesn't exist for given organization
    Schedule.findOne({org: orgName, role: role}, function(err, schedule){
        // If error occured
        if (err){
            fn(err);
        }
        // If schedule exists, just return error
        else if (schedule){
            // TODO: change error later
            fn({message: 'cannot create schedule, role exists'});
        }
        // If schedule doesn't exist, create schedule
        else {
            // Create new Schedule
            var schedule = new Schedule({
               org: orgName,
               role: role
            });

            // Add to database
            schedule.save(fn);
        }

    });
};

/**  
 * Retrieve a schedule, given its id.
 * @param {ObjectId} scheduleId The id of the schedule to be retrieved.
 * @param {Function} fn         Callback that takes (err, schedule).
 */
module.exports.retrieveSchedule = function(scheduleId, fn) {
    Schedule.findById(scheduleId, fn);
}

/**  
 * Delete a schedule.
 * @param {ObjectId} scheduleId The id of the schedule to be deleted.
 * @param {String}   orgName    Name of organization.
 * @param {Function} fn         Callback that takes (err, schedule).
 */
module.exports.deleteSchedule = function(scheduleId, orgName, fn) {
    Schedule.findOneAndRemove({_id: scheduleId, org: orgName}, fn);
}

/**  
 * Retrieve all schedules associated with an organization.
 * @param {String}   orgName Name of organization.
 * @param {Function} fn      Callback that takes (err, schedule).
 */
module.exports.retrieveSchedulesByOrg = function(orgName, fn) {
    Schedule.find({org: orgName}, fn);
}

/**  
 * Retrieve the schedule associated with an organization and a role.
 * @param {String}   orgName  Name of organization.
 * @param {String}   roleName Name of role.
 * @param {Function} fn       Callback that takes (err, schedule).
 */
module.exports.retrieveScheduleByOrgAndRole = function(orgName, roleName, fn) {
    Schedule.findOne({org: orgName, role: roleName}, fn);
}
