/**
 * All the functions related to manipulating and retrieving information
 * from the Shift database
 *
 * @author: Vicky Gong, Lily Seropian
 */

var Shift = require('../models/shift');
var errors = require('../errors/errors');
module.exports = {};

/**
 * Create a shift 
 *
 * @param {String} day: what day of the week the shift is on
 * @param {String} startTime: time the shift starts
 * @param {String} endTime: time the shift ends
 * @param {ObjectId} employeeId: id of the employee responsible for the shift
 * @param {ObjectId} scheduleId: id of the schedule with which the shift is associated
 * @param {ObjectId} templateShiftId: id of the template from which the shift is generated
 * @param {Date} date: date of shift
 * @param {function} fn: callback function
 * 
 * @return ---
 */
module.exports.createShift = function(day, startTime, endTime, employeeId, scheduleId, templateShiftId, date, fn) {
    var shift = new Shift({
       dayOfWeek: day,
       start: startTime,
       end: endTime,
       responsiblePerson: employeeId,
       schedule: scheduleId,
       templateShift: templateShiftId,
       dateScheduled: date,
       upForGrabs: false,
       upForSwap: false
    });

    shift.save(fn);
};

/**
 * Delete all shifts based on the same template shift
 *
 * @param {ObjectId} templateShiftId: id of the template shift
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.deleteShiftsGeneratedFromTemplateShift = function(templateShiftId, fn) {
    Shift.remove({templateShift: templateShiftId}, fn);
};

/**
 * Put a shift up for grabs
 *
 * @param {ObjectId} shiftId: id of the shift to be put up for grabs
 * @param {function} fn: callback function
 * 
 * @return ---
 */
module.exports.putUpForGrabs = function(shiftId, fn) {
    Shift.findByIdAndUpdate(shiftId, {upForGrabs: true}, fn);
};

/**
 * Grab a shift and give the shift's responbility to another
 * employee
 * 
 * @param {ObjectId} shiftId: id of the shift 
 * @param {ObjectId} employeeId: id of the employee that will take the shift 
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.giveShiftTo = function(shiftId, employeeId, fn) {
    Shift.findByIdAndUpdate(shiftId, {responsiblePerson: employeeId, upForGrabs: false}, fn);
};

/**
 * Mark a shift is up for swap
 *
 * @param {ObjectId} shiftId: id of the shift to be put up for swap
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.putUpForTrade = function(shiftId, fn) {
    Shift.findByIdAndUpdate(shiftId, {upForSwap: true}, fn);
};



/**
 * Switch the people responsible for the two given shifts
 *
 * @param {ObjectId} shiftIdA: id of the first shift
 * @param {ObjectId} shiftIdB: id of the second shift
 * @param {ObjectId} employeeIdA: id of the employee that is the owner of ShiftA
 * @param {ObjectId} employeeIdB: id of the employee that is the owner of ShiftB
 * @param {function} fn: callback function
 *   
 * @return ---
 * 
 * TODO: if the 2nd fails to occur, the first still occurs
 */
module.exports.tradeShifts = function(shiftIdA, shiftIdB, fn) {
    // Updating shiftA
    Shift.findById(shiftIdA, function(err, shiftA) {
        Shift.findById(shiftIdB, function(err, shiftB) {
            var temp = shiftA.responsiblePerson;

            shiftA.responsiblePerson = shiftB.responsiblePerson;
            shiftA.upForSwap = false;
            shiftA.save(function(err, shiftA) {
                if (err) {
                    return fn(err);
                }

                shiftB.responsiblePerson = temp;
                shiftB.upForSwap = false;
                shiftB.save(function(err, shiftB) {
                    if (err) {
                        return fn(err);
                    }
                    fn(null, [shiftA, shiftB]);
                });
            });
        });
    });
}

module.exports.getShift = function(shiftId, fn) {
    Shift.findOne({_id: '5467d03e11f40ea52059c6ae'}, fn);
}

/**
 * Get all shifts associated with a user
 *
 * @param {ObjectId} employeeId: id of the employee
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.getAllUserShifts = function(employeeId, fn) {
    Shift.find({responsiblePerson: employeeId}, fn);
}

/**
 * Get all shifts associated with a schedule
 *
 * @param {ObjectId} scheduleId: id of the schedule
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.getAllShiftsOnASchedule = function(scheduleId, fn) {
    Shift.find({schedule: scheduleId}, fn);
}

/**
 * Get all shifts currently on open offer
 * 
 * @param {ObjectId} scheduleId: id of the schedule
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.getOfferedShiftsOnASchedule = function(scheduleId, fn) {
    Shift.find({schedule: scheduleId, upForGrabs: true}, fn);
}

/**
 * Get all shifts currently up for grabs
 * 
 * @param {ObjectId} scheduleId: id of the schedule
 * @param {function} fn: callback function
 *
 * @return ---
 */
module.exports.getShiftsUpForSwapOnASchedule = function(scheduleId, fn) {
    Shift.find({schedule: scheduleId, upForSwap: true}, fn);
}