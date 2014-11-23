/**  
 * Email notifications.
 * 
 * TODO: error handling, permissions, send emails when on prod
 *
 * @author: Lily Seropian
 */

var sendgrid = require('sendgrid')('zhift', 'shifty6170');

var Record = require('../models/record');

module.exports = {};

/**
 * From address for email notifications.
 * @type {String}
 */
var FROM = '6170-zhift@mit.edu';

/**
 * Get a string representation of a shift for use in records.
 * Example: 'Monday, November 22, 2014 shift from 02:00 to 04:00'.
 * @param  {Shift}  shift The shift for which to create a string.
 * @return {String} The created string.
 */
var shiftToString = function(shift) {
    return shift.dateScheduled.toLocaleDateString() + ' shift from ' + shift.start + ' to ' + shift.end;
};

/**
 * Log errors to the console.
 * @param {String} err The error to log.
 */
var logErrors = function(err) {
    if (err) {
        console.log(err);
    }
};

/**
 * Get all records about a schedule.
 * @param {ObjectId} scheduleId The id of the schedule to get records for.
 * @param {Function} fn         Callback that takes (err, record[])
 */
module.exports.getRecordsForSchedule = function(scheduleId, fn) {
    Record.find({schedule: scheduleId}).sort([['_id', -1]]).exec(fn);
};

/**
 * Get a specific record.
 * @param {ObjectId} recordId The id of the record to get.
 * @param {Function} fn       Callback that takes (err, record)
 */
module.exports.getRecord = function(recordId, fn) {
    Record.findOneById(recordId, fn);
};

/**
 * Inform the manager(s) that an employee put up a shift for grabs.
 * @param {Array.<string>} to    A list of all email addresses to which to send the notification.
 * @param {String}         owner The name of the owner of the shift.
 * @param {Shift}          shift The shift that was offered.
 */
module.exports.recordShiftUpForGrabs = function(to, owner, shift) {
    var email = {
        to: to,
        from: FROM,
        subject: 'Shift Up For Grabs',
        text: owner + ' put their ' + shiftToString(shift) + ' up for grabs.',
    };
    console.log(email);
    new Record({content: email.text, schedule: shift.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};

/**
 * Inform the manager(s) and employees involved that a shift was claimed.
 * @param {Array.<string>} to            A list of all email addresses to which to send the notification.
 * @param {String}         originalOwner The name of the original owner of the shift.
 * @param {String}         newOwner      The name of the new owner of the shift.
 * @param {Shift}          shift         The shift that was claimed.
 */
module.exports.recordShiftClaim = function(to, originalOwner, newOwner, shift) {
    var email = {
        to: to,
        from: FROM,
        subject: 'Shift Claimed',
        text: newOwner + ' has claimed ' + originalOwner + '\'s ' + shiftToString(shift) + '.',
    };
    console.log(email);
    new Record({content: email.text, schedule: shift.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};

/**
 * Inform the manager(s) that an employee put up a shift for swap.
 * @param {Array.<string>} to    A list of all email addresses to which to send the notification.
 * @param {String}         owner The name of the owner of the shift.
 * @param {Shift}          shift The shift that was offered.
 */
module.exports.recordShiftUpForSwap = function(to, owner, shift) {
    var email = {
        to: to,
        from: FROM,
        subject: 'Shift Up For Swap',
        text: 'Shift up for swap.' + shift,
        text: owner + ' put their ' + shiftToString(shift) + ' up for swap.',
    };
    console.log(email);
    new Record({content: email.text, schedule: shift.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};

/**
 * Inform the manager(s) and the employee that put a shift up for swap that there's an offer for that swap.
 * @param {Array.<string>} to   A list of all email addresses to which to send the notification.
 * @param {Swap}           swap The swap affected.
 */
module.exports.recordSwapProposal = function(to, swap) {
    var proposedShift = swap.shiftOfferedInReturn;
    var proposer = proposedShift.responsiblePerson.name;
    var originalShift = swap.shiftUpForSwap;
    var owner = originalShift.responsiblePerson.name;

    var email = {
        to: to,
        from: FROM,
        subject: 'Swap Proposed',
        text: proposer + ' has offered their ' + shiftToString(proposedShift) + ' in exchange for ' + owner + '\'s ' + shiftToString(originalShift) + '.',
    };
    console.log(email);
    new Record({content: email.text, schedule: swap.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};

/**
 * Inform the manager(s) and the employee that made an offer for a swap that the offer was rejected.
 * @param {Array.<string>} to   A list of all email addresses to which to send the notification.
 * @param {Swap}           swap The swap affected.
 */
module.exports.recordSwapRejected = function(to, swap) {
    var proposedShift = swap.shiftOfferedInReturn;
    var proposer = proposedShift.responsiblePerson.name;
    var originalShift = swap.shiftUpForSwap;
    var owner = originalShift.responsiblePerson.name;

    var email = {
        to: to,
        from: FROM,
        subject: 'Swap Proposal Rejected',
        text: owner + ' has rejected ' + proposer + '\'s proposal to swap their ' + shiftToString(proposedShift) + ' with ' + owner + '\'s ' + shiftToString(originalShift) + '.',
    };
    console.log(email);
    new Record({content: email.text, schedule: swap.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};

/**
 * Inform the manager(s) and employees involved that a shift swap occurred.
 * @param {Array.<string>} to   A list of all email addresses to which to send the notification.
 * @param {Swap}           swap The swap that occurred.
 */
module.exports.recordSwapAccepted = function(to, swap) {
    var proposedShift = swap.shiftOfferedInReturn;
    var proposer = proposedShift.responsiblePerson.name;
    var originalShift = swap.shiftUpForSwap;
    var owner = originalShift.responsiblePerson.name;

    var email = {
        to: to,
        from: FROM,
        subject: 'Swap Occurred',
        text: owner + ' has accepted ' + proposer + '\'s proposal to swap their ' + shiftToString(proposedShift) + ' with ' + owner + '\'s ' + shiftToString(originalShift) + '.',
    };
    console.log(email);
    new Record({content: email.text, schedule: swap.schedule}).save(logErrors);
    // sendgrid.send(email, console.log);
};