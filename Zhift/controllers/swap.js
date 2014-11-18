/*  All the functions related to manipulating and retrieving information 
    from the Swap database

    @author: Vicky Gong, Lily Seropian
*/
var Swap = require('../models/swap');
var Shift = require('../models/shift');
var ShiftController = require('./shift');
var errors = require('../errors/errors');
module.exports = {};

/*  Function to create a swap
    
    @param 
        {ObjectId} shiftId:           what shift is being put up for swap
        {ObjectId} scheduleId:        scheduleId of the schedule the shfit belongs to
        {function} fn:                callback function
    @return ---
*/
module.exports.createSwap = function(shiftId, scheduleId, fn) {
    // Create new Shift
    var swap = new Swap({
       shiftUpForSwap: shiftId,
       schedule: scheduleId
    });

    // Add to database
    swap.save(function(err, swap) {
        Shift.findByIdAndUpdate(shiftId, {upForSwap: true}, function(err) {
            if (err) {
                return fn(err);
            }

            fn(swap);
        });
    });
};

module.exports.getSwapForShift = function(shiftId, fn) {
    Swap.findOne({shiftUpForSwap: shiftId}, fn);
}
/*  Function to get swaps associated with a schedule
    
    @param 
        {ObjectId} shiftId:           what shift is being put up for swap
        {ObjectId} scheduleId:        scheduleId of the schedule the shfit belongs to
        {function} fn:                callback function
    @return ---
*/
module.exports.getSwapsOnSchedule = function(scheduleId, fn) {
    Swap.find({schedule: scheduleId}, fn);
};

/*  Function to set up a shift for offer on a swap 
    Replaces old shiftOfferedInReturn with new value

    @param 
        {ObjectId} swapId:            id of swap object to edit
        {ObjectId} shiftId:           id of shift object to set as new shiftOfferedInReturn
        {function} fn:                callback function
    @return ---

*/
module.exports.offerShiftForSwap = function(swapId, shiftId, fn) {
    Swap.findByIdAndUpdate(swapId, {shiftOfferedInReturn: shiftId}, fn);
};

/*  Function to reset shiftOfferedInReturn to be an empty value

    @param 
        {ObjectId} swapId:            id of swap object to edit
        {function} fn:                callback function
    @return ---

*/
module.exports.resetOfferedShiftInSwap = function(swapId, fn) {
    Swap.findByIdAndUpdate(swapId, {shiftOfferedInReturn: null}, fn);
};

/*  Function to delete a swap

    @param 
        {ObjectId} swapId:            id of swap object to delete
        {function} fn:                callback function
    @return ---

*/
module.exports.deleteSwap = function(swapId, fn) {
    Swap.findByIdAndRemove(swapId, fn);
};

module.exports.acceptSwap = function(swap_id, fn) {
    Swap.findByIdAndRemove(swap_id, function(err, swap) {
        if (err) {
            console.log(err);
            return fn(err);
        }
        else {
            ShiftController.tradeShifts(swap.shiftUpForSwap, swap.shiftOfferedInReturn, fn);
        }
    });
}
