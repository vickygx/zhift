/*  All the functions related to manipulating and retrieving information 
    from the Schedule database

    @author: Anji Ren
*/
var Schedule = require('../models/schedule');
var errors = require('../errors/errors');
module.exports = {}

/*  Function to create a schedule
    
    @param 
        {String} orgName:       name of organization
        {String} role:          role for which schedule displays shifts for
        {function} fn:          call back function

    @return ---
*/
module.exports.createSchedule = function(orgName, role, fn){
    // Create new Schedule
    var schedule = new Schedule({
       org: orgName,
       role: role
    });

    // Add to database
    schedule.save(fn);
};

/*  Function to retrieve a schedule
    
    @param 
        {ObjectId} scheduleId:  id of the schedule to be retrieved
        {function} fn:          callback function

    @return ---
*/
module.exports.deleteSchedule = function(scheduleId, fn) {
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

/*  Function to get all schedules associated with an organization
    
    @param 
        {ObjectId} orgName:  name of organization
        {function} fn:       callback function

    @return ---
*/
module.exports.getSchedulesByOrg = function(orgName, fn) {
    Schedule.find({org: orgName}, fn);
}