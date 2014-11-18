/*  All the routes relating to swaps
    
    @author: Vicky Gong, Lily Seropian
*/
var express = require('express');
var router = express.Router();

// Controllers
var SwapController = require('../controllers/swap');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express through swap for now' });
});

/* POST request to create swap object */
router.post('/', function(req, res, next) {
    // TODO: requester must be owner of shiftId, check
    // TODO: one way to do this is pass bth owner and shiftId to createSwap function
    // and do Swap.find({_id: shiftId, originalOwner: userId}) and add originalOwner to schema
    // but there are other ways like making another DB call

    // TODO: modify shift to be upForSwap
    SwapController.createSwap(req.body.shiftId, req.body.scheduleId, function(err, swap) {
        // TODO: cover all error cases / send proper error
        if (err){
            // we can send custom errors instead
            console.log(err);
            next(err);
        } 
        else {
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
        SwapController.offerShiftForSwap(req.param('swap_id'), req.body.shiftId, function(err, swap) {
            // TODO: cover all error cases / send proper error
            if (err) {
                // we can send custom errors instead
                next(err);
            } 
            else {
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