/*  All the functions related to manipulating and retrieving information 
    from the Swap database

    @author: Vicky Gong, Lily Seropian
*/
var Swap = require('../models/swap');
var Shift = require('../models/shift');
var ShiftController = require('./shift');
var errors = require('../errors/errors');
module.exports = {};

/**
 * Create a Swap if the user has permission to do so.
 * @param {ObjectId} shiftId    The id of the shift to put up for swap.
 * @param {String} employeeId   The id of the employee putting the shift up for swap.
 * @param {ObjectId} scheduleId The id of the schedule to which the shift belongs.
 * @param {function} fn         Callback that takes (err, swap).
*/
module.exports.createSwap = function(shiftId, employeeId, scheduleId, fn) {
    // Create new Shift
    var swap = new Swap({
       shiftUpForSwap: shiftId,
       schedule: scheduleId
    });

    // Set the shift to be up for swap; checks to make sure the requester owns the shift
    Shift.findOneAndUpdate({_id: shiftId, responsiblePerson: employeeId}, {upForSwap: true}, function(err) {
        if (err) {
            return fn(err);
        }
        swap.save(function(err, swap) {
            if (err) {
                return fn(err);
            }
            fn(null, swap);
        });
    });
};

/**
 * Get the Swap object for a shift that is up for swap.
 * @param {String}   shiftId The id of the searched-for shift.
 * @param {Function} fn      Callback that takes (err, swap).
 */
module.exports.getSwapForShift = function(shiftId, fn) {
    Swap.findOne({shiftUpForSwap: shiftId}, fn);
}

/**
 * Get all swaps associated with a schedule.
 * @param {ObjectId} scheduleId The id of the schedule to search.
 * @param {function} fn         Callback that takes (err, swap[]).
*/
module.exports.getSwapsOnSchedule = function(scheduleId, fn) {
    Swap.find({schedule: scheduleId}, fn);
};

/**
 * Propose a shift to give in exchange for a shift that is up for swap.
 * @param {ObjectId} swapId  The id of the swap to edit.
 * @param {ObjectId} shiftId The id of the shift to give in exchange.
 * @param {function} fn      Callback that takes (err, swap).
 */
module.exports.offerShiftForSwap = function(swapId, shiftId, fn) {
    console.log('offering shift for swap', swapId, shiftId);
    Swap.findByIdAndUpdate(swapId, {shiftOfferedInReturn: shiftId}, fn);
};

/**
 * Reject a shift proposed in exhange for a shift that is up for grabs.
 * @param {ObjectId} swapId The id of swap containing the rejected shift.
 * @param {function} fn     Callback that takes (err, swap).
 */
module.exports.resetOfferedShiftInSwap = function(swapId, fn) {
    Swap.findByIdAndUpdate(swapId, {shiftOfferedInReturn: null}, fn);
};

/**
 * Delete a swap.
 * @param {ObjectId} swapId The id of the swap to delete.
 * @param {function} fn     Callback that takes (err, swap).
 */
module.exports.deleteSwap = function(swapId, fn) {
    Swap.findByIdAndRemove(swapId, fn);
};

/**
 * Accept a swap. Deletes the swap object and changes responsibility of the shift.
 * @param {ObjectId} swap_id The id of the swap to resolve.
 * @param {Function} fn      Callback that takes (err, swap).
 */
module.exports.acceptSwap = function(swap_id, fn) {
    Swap.findByIdAndRemove(swap_id, function(err, swap) {
        if (err) {
            console.log(err);
            return fn(err);
        }
        else {
            ShiftController.tradeShifts(swap.shiftUpForSwap, swap.shiftOfferedInReturn, function(err) {
                if (err) {
                    return fn(err);
                }
                return fn(null, swap);
            });
        }
    });
}