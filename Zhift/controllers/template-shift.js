/*  All the functions related to manipulating and retrieving information 
    from the Template Shift database

    @author: Anji Ren
*/
var TemplateShift = require('../models/template-shift');
var errors = require('../errors/errors');
module.exports = {}

/*  Function to create a template for a regularly occurring shift
    
    @param 
        {String} day:           what day of the week the shift is on
        {String} startTime:     time the shift starts
        {String} endTime:       time the shift ends
        {ObjectId} employeeId:  id of the employee regularly responsible for shift
        {ObjectId} scheduleId:  id of the schedule the shift is associated with
        {function} fn: 			callback function

    @return ---
*/
module.exports.createShift = function(day, startTime, endTime, employeeId, scheduleId, fn){
    // Create new Template Shift
    var shift = new TemplateShift({
       dayOfWeek: day,
       start: startTime,
       end: endTime,
       responsiblePerson: employeeId,
       schedule: scheduleId
    });

    // Add to database
    shift.save(fn);
};

/*  Function to retrieve a template for a regularly occurring shift
    
    @param 
        {ObjectId} shiftId:  id of the shift to be retrieved
        {function} fn:       callback function

    @return ---
*/
module.exports.retrieveShift = function(shiftId, fn){
    TemplateShift.findById(shiftId, fn);
};

/*  Function to delete a template for a regularly occurring shift
    
    @param 
        {ObjectId} shiftId:  id of the shift to be deleted
        {function} fn:       callback function

    @return ---
*/
module.exports.deleteShift = function(shiftId, fn){
    TemplateShift.findByIdAndRemove(shiftId, fn);
};

/*  Function that grabs a template shift and
    gives the shift's responsibility to another employee

    
    @param 
        {ObjectId} shiftId:     id of the shift 
        {ObjectId} employeeId:  id of the employee that will take the shift 
        {function} fn:          callback function

    @return ---
*/
module.exports.giveShiftTo = function(shiftId, employeeId, fn){
    TemplateShift.findByIdAndUpdate(shiftId, {responsiblePerson: employeeId}, fn);
}

/*  Function to get all template shifts associated with a schedule
    
    @param 
        {ObjectId} scheduleId:  id of the schedule shift is part of
        {function} fn:          callback function

    @return ---
*/
module.exports.getAllShiftsBySchedule = function(scheduleId, fn){
    TemplateShift.find({schedule: scheduleId}, fn);
}
