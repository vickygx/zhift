/**
 * All the routes relating to shifts.
 * 
 * TODO: error handling, permissions.
 * 
 * @author: Lily Seropian, Vicky Gong
 */

var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var UserController = require('../controllers/user');
var RecordController = require('../controllers/record');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');
var datejs = require('../public/javascripts/libraries/date');

router.get('/', function(req, res, next) {
    res.render('shift/test_shift', {title: 'shift calendar testing', user: req.user});
});

/**
 * POST to create a new shift.
 * Request body should contain:
 *     {String}   day             [REMOVE]
 *     {String}   startTime       [REMOVE]
 *     {String}   endTime         [REMOVE]
 *     {ObjectId} employeeId      [REMOVE]
 *     {ObjectId} scheduleId      [REMOVE]
 *     {ObjectId} templateShiftId The id of the template shift from which to generate the shift.
 *     {Date}     date            The date on which the shift occurs.
 * Response body contains:
 *     {Shift} The created shift.
 */
router.post('/', function(req, res, next) {
    // Checking if permissions are correct
    // TODO: replace with req.session.isManager
    UserController.isManagerOfOrganization(req.user.email, req.user.org, function(err, isManager) {
        if (isManager) {
            // TODO: generate from template shift, don't require day/startTime/endTime/employeeId/schedulEid
            day = req.body.day;
            startTime = req.body.startTime;
            endTime = req.body.endTime;
            employee = req.body.employeeId;
            schedule = req.body.scheduleId;
            templateShift = req.body.templateShiftId;
            date = req.body.date;

            ShiftController.createShift(day, startTime, endTime, employee, schedule, templateShift, date, function(err, shift) {
                if (err) {
                    return next(err);
                }
                res.send(shift);
            });
        }
        else {
            res.status(403).send({message: 'error: you are not a manager. cannot create shift'});
        }
    });
});

/**
 * GET a shift.
 * No request body parameters required.
 * Response body contains:
 *     {Shift} The retrieved shift.
 */
router.get('/:id', function(req, res, next) {
    ShiftController.getShift(req.param('id'), function(err, shift) {
        if (err) {
            return next(err);
        }
        if (shift.responsiblePerson.org !== req.user.org) {
            return res.status(403).send({message: 'error: you are not a user of this org. cannot get shift'});
        }
        res.send(shift);
    });
});

/**
 * GET all shifts associated with an employee.
 * No request body parameters required.
 * Response body contains:
 *     {Shift[]} The retrieved shifts.
 */
router.get('/user/:id', function(req, res, next) {
    // Checking if logged in user is userid
    console.log(req.user.schedule);
    if(req.param('id') !== req.user._id.toString() && req.user.schedule !== undefined) {
        console.log(req.param('id'));
        console.log(req.user._id.toString());
        console.log(req.user.schedule);
        return res.status(403).send({message: 'error: you are not a manager or the owner of this shift. cannot get'});
    }

    if (!req.user.schedule) {
        UserController.retrieveEmployeeById(req.param('id'), function(err, employee) {
            if (req.session.org !== employee.org) {
                return res.status(403).send({message: 'error: you are not a manager for this employee. cannot get'});
            }
        });
    }

    ShiftController.getAllUserShifts(req.param('id'), function(err, shifts) {
        if (err) {
            return next(err);
        }
        if (!shifts) {
            return next(errors.users.invalidUserId);
        }
        res.send(shifts);
    });
});


/**
 * GET all shifts associated with a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Shift[]} The retrieved shifts.
 */
router.get('/all/:id', function(req, res, next) {
    ShiftController.getAllShiftsOnASchedule(req.param('id'), function(err, shifts) {
        if (err) {
            return next(err);
        }
        if (!shifts) {
            return next(errors.schedules.invalidScheduleId);
        }
        res.send(shifts);
    });
});


/**
 * PUT shift up for grabs.
 * No request body parameters required.
 * Response body contains:
 *     {Shift} The shift put up for grabs.
 */
router.put('/upForGrabs/:id', function(req, res, next) {
    // putUpForGrabs checks that current user is owner of the shift
    ShiftController.putUpForGrabs(req.param('id'), req.user._id.toString(), function(err, shift) {
        if (err) {
            return next(err);
        }
        if (!shift) {
            return next(errors.shifts.invalidShiftId);
        }
        RecordController.recordShiftUpForGrabs(req.session.managerEmails, req.user.name, shift);
        res.send(shift);
    });
});


/**
 * GET all shifts up for grabs on a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Shift[]} The shifts up for grabs.
 */
router.get('/upForGrabs/:scheduleid', function(req, res, next) {
    ShiftController.getOfferedShiftsOnASchedule(req.param('scheduleid'), function(err, shifts) {
        if (err) {
            return next(err);
        }
        else if (!shifts) {
            return next(errors.schedules.invalidScheduleId);
        }
        res.send(shifts);
    });
});

/**
 * GET all shifts up for swap on a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Shift[]} The shifts up for swap.
 */
router.get('/upForSwap/:scheduleid', function(req, res, next) {
    ShiftController.getShiftsUpForSwapOnASchedule(req.param('scheduleid'), function(err, shifts) {
        if (err) {
            return next(err);
        }
        else if (!shifts) {
            return next(errors.schedules.invalidScheduleId);
        }
        res.send(shifts);
    });
});

/**
 * PUT claim a given shift.
 * No request body parameters required.
 * Response body contains:
 *     {Shift} The claimed shift.
 */
router.put('/claim/:id', function(req, res, next) {
    ShiftController.giveShiftTo(req.param('id'), req.body.employeeId, function(err, shift, originalOwner) {
        if (err) {
            return next(err);
        }
        if (!shift) {
            return next(errors.schedules.invalidShiftId);
        }
        var emails = req.session.managerEmails.slice(0);
        emails.push(originalOwner.email, req.user.email);
        RecordController.recordShiftClaim(emails, originalOwner.name, req.user.name, shift);

        res.send(shift);
    });
});

module.exports = router;