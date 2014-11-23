/**
 * Swap routes.
 * 
 * TODO: Error handling, permissions
 * 
 * @author: Vicky Gong, Lily Seropian
 */

var express = require('express');
var router = express.Router();

var SwapController = require('../controllers/swap');
var RecordController = require('../controllers/record');

var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/**
 * POST to create a new swap.
 * Sends an email notification to the manager(s) that an employee put a shift up for swap.
 * Request body should contain:
 *     {ObjectId} shiftId    The id of the shift to put up for swap.
 *     {ObjectId} scheduleId The id of the schedule the shift is on.
 * Response body contains:
 *     {Swap} The created swap.
 */
router.post('/', function(req, res, next) {
    // createSwap checks that the current user owns the shift for which to create a swap
    SwapController.createSwap(req.body.shiftId, req.user._id, req.body.scheduleId, function(err, swap) {
        if (err) {
            return next(err);
        } 

        RecordController.recordShiftUpForSwap(req.session.managerEmails, req.user.name, swap.shiftUpForSwap);

        res.send(swap);
    });
});

/**
 * GET the swap for a given up for swap shift.
 * No request body parameters required.
 * Response body contains:
 *     {Swap} The found swap.
 */
router.get('/shift/:id', function(req, res, next) {
    SwapController.getSwapForShift(req.param('id'), function(err, swap) {
        if (err || !swap) {
            return next(err);
        }
        res.send(swap);
    });
});

/**
 * GET all swaps for a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Swap[]} The found swaps.
 */
router.get('/schedule/:id', function(req, res, next) {
    SwapController.getSwapsOnSchedule(req.param('id'), function(err, swaps) {
        if (err) {
            return next(err);
        } 
        res.send(swaps);
    });
});

/**
 * PUT to propose a shift in exchange, accept a proposed swap, or reject a proposed swap.
 * Sends email notifications for all changes.
 * Request body should contain:
 *     {ObjectId?} shiftId    The id of the shift to propose. Should not be specified when accepting or rejecting a swap.
 *     {String}   acceptSwap 'true' to accept a swap, 'false' to reject it. Should not be specified when proposing a shift in exchange.
  * Response body contains:
 *     {Swap} The affected swap.
 */
router.put('/:id', function(req, res, next) {
    if (req.body.shiftId !== undefined) {
        SwapController.offerShiftForSwap(req.param('id'), req.body.shiftId, function(err, swap) {
            if (err) {
                return next(err);
            } 

            swap.shiftOfferedInReturn.responsiblePerson.name = req.user.name;
            RecordController.recordSwapProposal(req.session.managerEmails, swap);

            res.send(swap);
        });
    }
    else {
        var emails = req.session.managerEmails.slice(0);

        if (req.body.acceptSwap === 'true') {
            SwapController.acceptSwap(req.param('id'), function(err, swap) {
                if (err) {
                    return next(err);
                }
                emails.push(swap.shiftOfferedInReturn.responsiblePerson.email);
                swap.shiftUpForSwap.responsiblePerson.name = req.user.name;
                RecordController.recordSwapAccepted(emails, swap);

                res.send(swap);
            });
        }
        else if (req.body.acceptSwap === 'false') {
            SwapController.resetOfferedShiftInSwap(req.param('id'), function(err, swap) {
                if (err) {
                    return next(err);
                }
                emails.push(swap.shiftOfferedInReturn.responsiblePerson.email);
                swap.shiftUpForSwap.responsiblePerson.name = req.user.name;
                RecordController.recordSwapRejected(emails, swap);

                res.send(swap);
            });
        }
        else {
            res.status(400).send('Unidentified request.');
        }
    }
});

module.exports = router;