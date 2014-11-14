/*  All the functions related to manipulating and retrieving information 
    from the Shift database

    @author: Vicky Gong
*/
var Shift = require('../models/shift');
var errors = require('../errors/errors');
module.exports = {};

/*  Function to create a shift
    
    @param 
        {String} day:           what day of the week the shift is on
        {String} startTime:     time the shift starts
        {String} endTime:       time the shift ends
        {ObjectId} employeeId:  id of the employee responsible for shift
        {ObjectId} scheduleId:  id of the schedule the shift is associated with
        {Date} date:            date of shift
        {function} fn :         call back function

    @return ---
*/
module.exports.createShift = function(day, startTime, endTime, employeeId, scheduleId, date, fn){
    // Create new Shift
    var shift = new Shift({
       dayOfWeek: day,
       start: startTime,
       end: endTime,
       responsiblePerson: employeeId,
       schedule: scheduleId,
       dateScheduled: date,
       upForGrabs: false,
       upForSwap: false
    });

    // Add to database
    shift.save(fn);
};

/*  Function to delete all shifts based on the same template shift
    
    @param 
        {ObjectId} templateShiftId:  id of the template shift
        {function} fn :         call back function

    @return ---
*/
module.exports.deleteShiftsOnTemplateShift = function(templateShiftId, fn){
    Shift.remove({templateShift: templateShiftId}, fn);
}

/*  Function to put a shift up for grabs
    
    @param 
        {ObjectId} shiftId:  id of the shift to be put up for grabs
        {function} fn :         call back function

    @return ---
*/
module.exports.putUpForGrabs = function(shiftId, fn){
    Shift.findByIdAndUpdate(shiftId, {upForGrabs: true}, fn);
};

/*  Function that grabs a shift and
    gives the shift's responbility to another employee

    
    @param 
        {ObjectId} shiftId:     id of the shift 
        {ObjectId} employeeId:  id of the employee that will take the shift 
        {function} fn :         call back function

    @return ---
*/
module.exports.giveShiftTo = function(shiftId, employeeId, fn){
    Shift.findByIdAndUpdate(shiftId, {responsiblePerson: employeeId, upForGrabs: false}, fn);
}

/*  Function to mark a shift is up for swap
    
    @param 
        {ObjectId} shiftId:  id of the shift to be put up for swap
        {function} fn :         call back function

    @return ---
*/
module.exports.putUpForTrade = function(shiftId, fn){
    Shift.findByIdAndUpdate(shiftId, {upForSwap: true}, fn);
};



/*  Function that switches the people responsible 
    for the two given shifts

    @param 
        {ObjectId} shiftIdA:     id of the first shift
        {ObjectId} shiftIdB:     id of the second shift
        {ObjectId} employeeIdA:  id of the employee that is the owner of ShiftA
        {ObjectId} employeeIdB:  id of the employee that is the owner of ShiftB
        {function} fn :          call back function
    
    @return ---

    @TODO: if the 2nd fails to occur, the first still occurs
*/
module.exports.tradeShifts = function(shiftIdA, employeeIdA, shiftIdB, employeeIdB, fn){
    // Updating shiftA
    Shift.findByIdAndUpdate(shiftIdA, 
        {responsiblePerson: employeeIdB, upForGrabs: false}, function(err, shift){
            // If there is an error, return the error
            if (err)
                fn(err);
            // If update worked, do the same for shiftB
            else if (shift){
                Shift.findByIdAndUpdate(shiftIdB, 
                    {responsiblePerson: employeeIdA, upForGrabs: false}, fn);
            }    
        });
}

/*  Function to get all shifts associated to a user
    
    @param 
        {ObjectId} employeeId:  id of the employee
        {function} fn :         call back function

    @return ---
*/
module.exports.getAllUserShifts = function(employeeId, fn){
    Shift.find({responsiblePerson: employeeId}, fn);
}

/*  Function to get all shifts associated to a schedule
    
    @param 
        {ObjectId} scheduleId:  id of the schedule
        {function} fn :         call back function

    @return ---
*/
module.exports.getAllShiftsOnASchedule = function(scheduleId, fn){
    Shift.find({schedule: scheduleId}, fn);
}

/*  Function to get all shifts currently on open offer
    
    @param 
        {ObjectId} scheduleId:  id of the schedule
        {function} fn :         call back function

    @return ---
*/
module.exports.getOfferedShiftsOnASchedule = function(scheduleId, fn){
    Shift.find({schedule: scheduleId, upForGrabs: true}, fn);
}
