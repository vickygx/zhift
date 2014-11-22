/**
 * All the routes relating to shifts
 * 
 * @author: Vicky Gong, Lily Seropian
 */

var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var UserController = require('../controllers/user');
var EmailController = require('../controllers/email');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

router.get('/', function(req, res, next) {
    res.render('shift/test_shift', {title: 'shift calendar testing'});
});

/**
 * POST request to create shift
 */
router.post('/', function(req, res, next) {
    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, function(err, isManager) {
        // If the user is a manager, create the shift
        if (isManager) {

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

/**
 * GET request to get a shift given an id
 */
router.get('/:id', function(req, res, next) {
    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.user.org, function(err, isUser) {   
        // If the user is in organization, get the shift
        if (isUser) {
            ShiftController.getShift(req.param('id'), function(err, shift) {
                if (err) {
                    next(err);
                }
                else {
                    res.send(shift);
                }
            });
        }
        else {
            // TODO: temporary json, replace with proper error
            res.status(403).send({message: 'error: you are not a user. cannot get shift'});
        }
    });
});

/**
 * GET request to get all shifts associated with a user
 */
router.get('/user/:userid', function(req, res, next) {
    // Checking if logged in user is userid
    var isOwner = req.param('userid') === req.user._id.toString();

    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, function(err, isManager) {
        // If the user is a manager, delete the schedule
        if (isManager || isOwner) {
            ShiftController.getAllUserShifts(req.param('userid'), function(err, shifts) {
                // TODO: error handling
                if (err) {
                    next(err);
                }
                else if (shifts) {
                    res.send({'shifts': shifts});
                }
                else {
                    next(errors.users.invalidUserId);
                }
            });
        }
        else {
            // TODO: temporary json, replace with proper error
            res.status(403).send({message: 'error: you are not a manager or the owner of this shift. cannot get'});
        }
    });
});


/**
 * GET request to get all shifts associated with a schedule
 */
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


/**
 * PUT request to put shift up for grabs
 */
router.put('/upForGrabs/:id', function(req, res, next) {
    // putUpForGrabs checks that current user is owner of the shift
    ShiftController.putUpForGrabs(req.param('id'), req.user._id.toString(), function(err, shift) {
        if (err) {
            next(err);
        }
        else if (shift) {
            UserController.retrieveManagersByOrgId(req.user.org, function(err, managers) {
                var emails = managers.map(function(manager) {
                    return manager.email;
                });
                EmailController.notifyShiftUpForGrabs(emails, req.user.name, shift);
            });

            res.send(shift);
        }
        else {
            next(errors.shifts.invalidShiftId);
        }
    });
});


/**
 * GET request to get all shifts being offered associated with a schedule
 */
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

/**
 * GET request to get all shifts being offered for swapping
 */
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

/**
 * PUT request to claim a given shift by user who is logged in
 */
router.put('/claim/:id', function(req, res, next) {
    // TODO: Make sure user logged in is in same schedule as shift to claim

    ShiftController.giveShiftTo(req.param('id'), req.body.employeeId, function(err, shift, originalOwner) {
        // TODO : error handling
        if (err) {
            next(err);
        }
        else if (shift) {
            UserController.retrieveManagersByOrgId(req.user.org, function(err, managers) {
                var emails = managers.map(function(manager) {
                    return manager.email;
                });
                emails.push(originalOwner.email, req.user.email);
                EmailController.notifyShiftClaim(emails, originalOwner.name, req.user.name,shift);
            });

            res.send(shift);
        }
        else {
            next(errors.schedules.invalidShiftId);
        }
    });
});

module.exports = router;