/*  All the functions related to manipulating and retrieving information 
    from the Schedule database

    @author: Anji Ren, Dylan Joss
*/
var Schedule = require('../models/schedule');
var errors = require('../errors/errors');
module.exports = {};

/*  Function to create a schedule
    
    @param 
        {String} orgName:       name of organization
        {String} role:          role for which schedule displays shifts for
        {function} fn:          call back function

    @return ---
*/
module.exports.createSchedule = function(orgName, role, fn) {
    // Make sure role doesn't exist for given organization
    Schedule.findOne({org: orgName, role: role}, function(err, schedule){
        // If error occured
        if (err){
            fn(err);
        }
        // If schedule exists, just return existing schedule
        else if (schedule){
            fn(null, schedule);
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

/*  Function to retrieve a schedule
    
    @param 
        {ObjectId} scheduleId:  id of the schedule to be retrieved
        {function} fn:          callback function

    @return ---
*/
module.exports.retrieveSchedule = function(scheduleId, fn) {
    Schedule.findById(scheduleId, fn);
}

/*  Function to delete a schedule
    
    @param 
        {ObjectId} scheduleId:  id of the schedule to be deleted
        {function} fn:          callback function

    @return ---
*/
module.exports.deleteSchedule = function(scheduleId, fn) {
    Schedule.findByIdAndRemove(scheduleId, fn);
}

/*  Function to retrieve all schedules associated with an organization
    
    @param 
        {String} orgName:  name of organization
        {function} fn:       callback function

    @return ---
*/
module.exports.retrieveSchedulesByOrg = function(orgName, fn) {
    Schedule.find({org: orgName}, fn);
}

/*  Function to retrieve the schedule associated with an organization and a role
    
    @param 
        {String} orgName:  name of organization
        {String} roleName: name of role
        {function} fn:       callback function

    @return ---
*/
module.exports.retrieveScheduleByOrgAndRole = function(orgName, roleName, fn) {
    console.log(orgName);
    console.log(roleName);
    Schedule.findOne({org: orgName, role: roleName}, fn);
}
