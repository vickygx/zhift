/*  All the routes relating to swaps
    
    @author: Vicky Gong, Lily Seropian
*/
var express = require('express');
var router = express.Router();

// Controllers
var SwapController = require('../controllers/swap');
var EmailController = require('../controllers/email');
var UserController = require('../controllers/user');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express through swap for now' });
});

/* POST request to create swap object */
router.post('/', function(req, res, next) {
    // createSwap checks that the current user owns the shift for which to create a swap
    SwapController.createSwap(req.body.shiftId, req.user._id, req.body.scheduleId, function(err, swap) {
        // TODO: cover all error cases / send proper error
        if (err) {
            next(err);
        } 
        else {
            UserController.retrieveManagersByOrgId(req.user.org, function(err, managers) {
                var emails = managers.map(function(manager) {
                    return manager.email;
                });
                EmailController.notifyShiftUpForSwap(emails, req.user.name, swap.shiftUpForSwap);
            });

            res.send(swap);
        }
    });
});

router.get('/shift/:shift_id', function(req, res, next) {
    SwapController.getSwapForShift(req.param('shift_id'), function(err, swap) {
        if (err) {
            next(err);
        }
        else {
            res.send(swap);
        }
    });
});

/* GET request to get all swap objects related to a schedule*/
router.get('/schedule/:schedule_id', function(req, res, next) {
    // TODO; requester must be user of schedule or manager

    SwapController.getSwapsOnSchedule(req.param('schedule_id'), function(err, swap) {
        // TODO: cover all error cases / send proper error
        if (err) {
            // we can send custom errors instead
            next(err);
        } 
        else {
            res.send(swap);
        }
    });
});

/* PUT request to offer a shift up for swap, accept proposed swap */
router.put('/:swap_id', function(req, res, next) {
    // TODO: make sure in same schedule
    // make sure shiftofferedinreturn is empty
    if (req.body.shiftId !== undefined) {
        console.log('swapping shift');
        SwapController.offerShiftForSwap(req.param('swap_id'), req.body.shiftId, function(err, swap) {
            // TODO: cover all error cases / send proper error
            if (err) {
                // we can send custom errors instead
                console.log(err);
                next(err);
            } 
            else {
                console.log('swap succeeded');
                res.send(swap);
            }
        });
    }
    else {
        if (req.body.acceptSwap === 'true') {
            SwapController.acceptSwap(req.param('swap_id'), function(err, swap) {
                if (err) {
                    console.log(err);
                    next(err);
                }
                else {
                    res.send(swap);
                }
            });
        }
    }
});

module.exports = router;