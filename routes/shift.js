/**
 * All the routes relating to shifts
 * 
 * @author: Vicky Gong, Lily Seropian
 */

var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

router.get('/', function(req, res, next) {
    res.render('shift/test_shift', {title: 'shift calendar testing'});
});

/*  POST request to create shift */
router.post('/', function(req, res, next) {
    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, 
        function(err, isManager){

            // If the user is a manager, create the shift
            if (isManager){

                // Getting parameters
                day = req.body.day;
                startTime = req.body.startTime;
                endTime = req.body.endTime;
                employee = req.body.employeeId;
                schedule = req.body.scheduleId;
                templateShift = req.body.templateShiftId;
                date = req.body.date;

                // TODO sanitize parameters? / make sure they exist?

                ShiftController.createShift(day, startTime, endTime, employee, schedule, templateShift, date, function(err, shift) {
                    // TODO: cover all error cases / send proper error
                    if (err) {
                        // we can send custom errors instead
                        next(err);
                    } 
                    else {
                        res.send(shift);
                    }
                });
                
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a manager. cannot create shift'});
            }
        });

});

/*  GET request to get a shift given an id */
router.get('/:id', function(req, res, next) {
    
    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.user.org, 
        function(err, isUser){   

            // If the user is in organization, get the shift
            if (isUser){
                ShiftController.getShift(req.param('id'), function(err, shift) {
                    if (err) {
                        next(err);
                    } else {
                        res.send(shift);
                    }
                })
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a user. cannot get shift'});
            }
        });

});

/*  GET request to get all shifts associated with a user*/
router.get('/user/:userid', function(req, res, next) {
    // Checking if logged in user is userid
    var isOwner = req.param('userid') === req.user._id;

    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, 
        function(err, isManager){

            // If the user is a manager, delete the schedule
            if (isManager || isOwner){
                ShiftController.getAllUserShifts(req.param('userid'), function(err, shifts) {
                    // TODO: error handling
                    if (err) {
                        next(err);
                    } 
                    else if (shifts){
                        res.send({'shifts': shifts});
                    } 
                    else {
                        next(errors.users.invalidUserId);
                    }
                });
                
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a manager. cannot delete'});
            }
        });
    
});


/*  GET request to get all shifts associated with a schedule */
router.get('/all/:scheduleid', function(req, res, next) {
    
    ShiftController.getAllShiftsOnASchedule(req.param('scheduleid'), function(err, shifts) {
        if (err) {
            next(err);
        } 
        else if (shifts) {
            res.send(shifts);
        } 
        else {
            next(errors.schedules.invalidScheduleId);
        }
    });
});


/*  POST request to put shift up for grabs */
router.put('/putUpForGrabs/:id', function(req, res, next) {
    // Only owner of shift can put a shift up for grabs
    var isOwner = req.param('userid') === req.user._id;

    if (isOwner){
        ShiftController.putUpForGrabs(req.param('id'), function(err, shift) {
            if (err) {
                next(err);
            } 
            else if (shift){
                res.send(shift);
            } 
            else {
                next(errors.shifts.invalidShiftId);
            }
        });
    }
    else {
        next(errors.shifts.notOwnerOfShift);
    }
    
});


/*  GET request to get all shifts being offered associated with a schedule */
router.get('/upForGrabs/:scheduleid', function(req, res, next) {

    ShiftController.getOfferedShiftsOnASchedule(req.param('scheduleid'), function(err, shifts) {
        if (err) {
            next(err);
        }
        else if (shifts) {
            res.send({'shifts': shifts});
        }
        else {
            next(errors.schedules.invalidScheduleId);
        }
    });
});

/*  GET request to get all shifts being offered for swapping */
router.get('/upForSwap/:scheduleid', function(req, res, next) {

    ShiftController.getShiftsUpForSwapOnASchedule(req.param('scheduleid'), function(err, shifts) {
        if (err) {
            next(err);
        }
        else if (shifts) {
            res.send({'shifts': shifts});
        }
        else {
            next(errors.schedules.invalidScheduleId);
        }
    });
});

/*  PUT request to claim a given shift by user who is logged in */
router.put('/claim/:id', function(req, res, next) {
    // TODO: Make sure user logged in is in same schedule as shift to claim

    ShiftController.giveShiftTo(req.param('id'), req.body.employeeId, function(err, shift) {
        // TODO : error handling
        if (err) {
            next(err);
        }
        else if (shift) {
            res.send(shift);
        }
        else {
            next(errors.schedules.invalidShiftId);
        }
    });
});

module.exports = router;